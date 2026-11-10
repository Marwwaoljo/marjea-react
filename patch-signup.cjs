const fs = require('fs');
const path = require('path');

const file = path.resolve('artifacts/marjea/src/components/account-signup-flow.tsx');
const source = fs.readFileSync(file, 'utf8');
let s = source;

function replaceOnce(oldText, newText, label) {
  const count = s.split(oldText).length - 1;
  if (count !== 1) throw new Error(`${label}: expected 1 match, found ${count}`);
  s = s.replace(oldText, newText);
}

function replaceBetween(start, end, replacement, label) {
  const a = s.indexOf(start);
  const b = s.indexOf(end, a + start.length);
  if (a < 0 || b < 0) throw new Error(`${label}: section boundaries not found`);
  s = s.slice(0, a) + replacement + s.slice(b);
}

// Imports and step types
replaceOnce('  useIssueRegistrationPhoneProof,\n', '', 'phone proof import');
replaceOnce(
  "import { ArrowRight, Check, FileCheck2, FileUp, Phone, ShieldCheck } from 'lucide-react';",
  "import { ArrowRight, FileCheck2, FileUp, ShieldCheck } from 'lucide-react';",
  'icons import'
);
replaceOnce(
  "import { PhoneVerificationConfigurationError, completePhoneVerification, normalizeSaudiMobileNumber, phoneVerificationConfigurationMessage, startSaudiPhoneVerification } from '@/lib/phone-verification';",
  "import { normalizeSaudiMobileNumber } from '@/lib/account-registration-policy';",
  'phone verification import'
);
// Keep the policy import only once.
replaceOnce(
  "import { getPermitUploadContentType, hasAtLeastTwoNameWords, isRegistrationEmailDomainAllowed } from '@/lib/account-registration-policy';",
  "import { getPermitUploadContentType, hasAtLeastTwoNameWords, isRegistrationEmailDomainAllowed } from '@/lib/account-registration-policy';",
  'policy import check'
);
replaceOnce(
  "type SignUpStep = 'details' | 'phone' | 'email' | 'finishing' | 'blocked';\ntype SignupMethod = 'password' | 'google';",
  "type SignUpStep = 'details' | 'email' | 'finishing' | 'blocked';",
  'step types'
);

// Remove phone-only state and hook.
for (const line of [
  "  const [smsCode, setSmsCode] = useState('');\n",
  "  const [codeSent, setCodeSent] = useState(false);\n",
  "  const [firebaseIdToken, setFirebaseIdToken] = useState('');\n",
  "  const [signupMethod, setSignupMethod] = useState<SignupMethod>('password');\n",
  "  const [phoneVerifiedAt, setPhoneVerifiedAt] = useState(0);\n",
  "  const [emailVerified, setEmailVerified] = useState(false);\n",
  "  const issuePhoneProof = useIssueRegistrationPhoneProof();\n"
]) {
  if (!s.includes(line)) throw new Error(`Missing state/hook: ${line.trim()}`);
  s = s.replace(line, '');
}

// Remove Google phone-proof path.
replaceBetween(
  '  async function continueWithGoogle() {',
  'async function verifyEmail() {',
  '',
  'Google signup function'
);

// Email verification completes Clerk signup and then account registration.
replaceBetween(
  'async function verifyEmail() {',
  '  async function resendEmailCode()',
`  async function verifyEmail() {
    setError('');
    if (!clerkLoaded || !signUp || !emailCode.trim()) return;

    setBusy(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: emailCode.trim(),
      });

      if (result.status !== 'complete' || !signUp.createdSessionId) {
        console.error('[MARJEA] Clerk signup requirements:', {
          status: result.status,
          missingFields: result.missingFields,
          unverifiedFields: result.unverifiedFields,
        });
        setError(tr(
          'Email verification is incomplete. Check the code and try again.',
          'لم يكتمل التحقق من البريد الإلكتروني. تحقق من الرمز وحاول مرة أخرى.'
        ));
        return;
      }

      await completeRegistration();
    } catch (reason) {
      setError(
        clerkErrorMessage(reason) ??
        tr(
          'The email code is invalid or expired. Request a new code.',
          'رمز البريد غير صالح أو منتهي الصلاحية. اطلب رمزًا جديدًا.'
        )
      );
    } finally {
      setBusy(false);
    }
  }

`,
  'email verification'
);

// Remove SMS sending function.
replaceBetween(
  '  async function sendPhoneCode() {',
  '  async function uploadPermit()',
  '',
  'SMS function'
);

// Registration no longer accepts or sends a Firebase token.
replaceBetween(
  '  async function completeRegistration(phoneToken: string) {',
  '  if (auth.isLoaded',
`  async function completeRegistration() {
    if (!clerkLoaded || !signUp || !setActive || !signUp.createdSessionId) {
      setError(tr(
        'Email verification is not complete. Repeat that step before continuing.',
        'لم يكتمل التحقق من البريد. أعد هذه الخطوة قبل المتابعة.'
      ));
      setStep('blocked');
      return;
    }

    setBusy(true);
    setError('');
    setStep('finishing');

    try {
      const normalizedPhone = normalizeSaudiMobileNumber(phone);
      if (!normalizedPhone) throw new Error('Invalid Saudi mobile number.');

      await setActive({ session: signUp.createdSessionId });

      const checked = await eligibility.refetch();
      if (checked.isError || !checked.data) {
        setError(tr(
          'Email eligibility could not be checked. Open account setup to retry safely.',
          'تعذر التحقق من أهلية البريد. افتح إعداد الحساب لإعادة المحاولة بأمان.'
        ));
        setStep('blocked');
        return;
      }

      if (!checked.data.eligible) {
        const message = eligibilityMessages[checked.data.reason];
        setError(message?.[ar ? 1 : 0] ?? tr(
          'This email is not eligible for this account type.',
          'هذا البريد غير مؤهل لنوع الحساب المحدد.'
        ));
        setStep('blocked');
        return;
      }

      await register.mutateAsync({
        data: {
          accountType,
          fullName: fullName.trim(),
          phoneNumber: normalizedPhone,
          ...(accountType === 'institution'
            ? { institutionName: institutionName.trim() }
            : {}),
        },
      });

      if (accountType === 'institution') await uploadPermit();

      const verifiedStatus = await registrationStatus.refetch();
      if (verifiedStatus.isError || !verifiedStatus.data) {
        setError(tr(
          'Your registration was submitted, but its status could not be confirmed. Open account setup to review it; workspace access remains closed.',
          'تم إرسال التسجيل، لكن تعذر تأكيد حالته. افتح إعداد الحساب لمراجعته؛ وستبقى مساحة العمل مغلقة.'
        ));
        setStep('blocked');
        return;
      }

      const destination = accountDestination(verifiedStatus.data, 0);
      if (accountType === 'individual' && destination === '/individual') {
        setLocation('/individual');
      } else if (accountType === 'institution' && destination === '/workspace') {
        setLocation('/workspace');
      } else {
        setLocation('/account');
      }
    } catch (reason) {
      console.error('[MARJEA] Registration completion failed:', reason);
      setError(tr(
        'Account registration could not be completed. Continue from account setup after signing in.',
        'تعذر إكمال تسجيل الحساب. تابع من إعداد الحساب بعد تسجيل الدخول.'
      ));
      setStep('blocked');
    } finally {
      setBusy(false);
    }
  }

`,
  'registration function'
);

// Remove Google button and separator.
replaceOnce(
  '      {accountType === \'individual\' && <button type="button" className="ma-google-signup" onClick={() => void continueWithGoogle()} disabled={busy || !clerkLoaded} data-testid="button-signup-google"><span className="ma-google-g" aria-hidden="true">G</span>{tr(\'Continue with Google\', \'المتابعة باستخدام Google\')}</button>}\n',
  '',
  'Google signup button'
);
replaceOnce(
  '      {accountType === \'individual\' && <div className="ma-auth-separator"><span>{tr(\'OR USE EMAIL\', \'أو استخدم البريد الإلكتروني\')}</span></div>}\n',
  '',
  'Google separator'
);

// Remove phone verification screen.
replaceBetween(
  "    {step === 'phone' && <div className=\"ma-signup-form\"",
  "    {step === 'finishing' &&",
  '',
  'phone verification UI'
);

// Update finishing text.
replaceOnce(
  "tr('Your personal space opens after your email and phone are verified.', 'تُفتح مساحتك الشخصية بعد التحقق من البريد والجوال.')",
  "tr('Your personal space opens after your email is verified.', 'تُفتح مساحتك الشخصية بعد التحقق من البريد الإلكتروني.')",
  'finishing text'
);

// Remove stale reset statements from beginEmailVerification.
for (const line of [
  "    setSignupMethod('password');\n",
  "    setEmailVerified(false);\n",
  "    setCodeSent(false);\n",
  "    setSmsCode('');\n",
  "    setFirebaseIdToken('');\n",
  "    setPhoneVerifiedAt(0);\n"
]) {
  s = s.replace(line, '');
}

// Verify that phone authentication has been removed.
const forbidden = [
  'firebaseIdToken',
  'phoneVerifiedAt',
  'smsCode',
  'sendPhoneCode',
  'verifyPhoneAndRegister',
  'issuePhoneProof',
  'useIssueRegistrationPhoneProof',
  'phone-verification',
  'continueWithGoogle',
  'SignupMethod',
  "step === 'phone'",
  'marjea-phone-recaptcha',
  'completeRegistration(phoneToken'
];
const remaining = forbidden.filter(x => s.includes(x));
if (remaining.length) throw new Error('Phone-auth references remain: ' + remaining.join(', '));

if (!s.includes('value={phone}') || !s.includes('phoneNumber: normalizedPhone')) {
  throw new Error('Required phone input or saved phone payload is missing.');
}
if (!s.includes("strategy: 'email_code'") || !s.includes('attemptEmailAddressVerification')) {
  throw new Error('Clerk email verification flow is missing.');
}

// Backup and atomic write.
const backup = file + '.before-email-only-' + new Date().toISOString().replace(/[:.]/g, '-');
fs.copyFileSync(file, backup);
const temp = file + '.tmp';
fs.writeFileSync(temp, s, 'utf8');
fs.renameSync(temp, file);

const saved = fs.readFileSync(file, 'utf8');
if (saved !== s) throw new Error('Post-write verification failed.');

console.log('SUCCESS: email-only signup flow written.');
console.log('Backup: ' + backup);
console.log('Phone input retained; SMS/OTP/reCAPTCHA and Firebase token removed.');
