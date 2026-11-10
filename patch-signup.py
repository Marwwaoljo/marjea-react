from pathlib import Path

p = Path("artifacts/marjea/src/components/account-signup-flow.tsx")
s = p.read_text(encoding="utf-8")

def replace_once(old, new, label):
    global s
    count = s.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected 1 match, found {count}")
    s = s.replace(old, new, 1)

def replace_section(start, end, new, label):
    global s
    a = s.find(start)
    b = s.find(end, a + len(start))
    if a < 0 or b < 0:
        raise RuntimeError(f"Could not locate section: {label}")
    s = s[:a] + new + s[b:]

replace_once(
    "type SignUpStep = 'details' | 'phone' | 'email' | 'finishing' | 'blocked';\ntype SignupMethod = 'password' | 'google';",
    "type SignUpStep = 'details' | 'email' | 'finishing' | 'blocked';",
    "step types"
)

replace_once("  useIssueRegistrationPhoneProof,\n", "", "phone proof import")
replace_once(
    "import { ArrowRight, Check, FileCheck2, FileUp, Phone, ShieldCheck } from 'lucide-react';",
    "import { ArrowRight, FileCheck2, FileUp, ShieldCheck } from 'lucide-react';",
    "icons"
)
replace_once(
    "import { PhoneVerificationConfigurationError, completePhoneVerification, normalizeSaudiMobileNumber, phoneVerificationConfigurationMessage, startSaudiPhoneVerification } from '@/lib/phone-verification';\n",
    "",
    "phone verification import"
)

for line in [
    "  const [smsCode, setSmsCode] = useState('');\n",
    "  const [codeSent, setCodeSent] = useState(false);\n",
    "  const [firebaseIdToken, setFirebaseIdToken] = useState('');\n",
    "  const [signupMethod, setSignupMethod] = useState<SignupMethod>('password');\n",
    "  const [phoneVerifiedAt, setPhoneVerifiedAt] = useState(0);\n",
    "  const [emailVerified, setEmailVerified] = useState(false);\n",
    "  const issuePhoneProof = useIssueRegistrationPhoneProof();\n",
]:
    replace_once(line, "", "phone state or hook")

replace_section(
    "  async function continueWithGoogle() {",
    "async function verifyEmail() {",
    "",
    "Google phone-dependent signup"
)

replace_section(
    "async function verifyEmail() {",
    "  async function resendEmailCode()",
    """async function verifyEmail() {
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
    setError(clerkErrorMessage(reason) ?? tr(
      'The email code is invalid or expired. Request a new code.',
      'رمز البريد غير صالح أو منتهي الصلاحية. اطلب رمزًا جديدًا.'
    ));
  } finally {
    setBusy(false);
  }
}

""",
    "email verification"
)

replace_section(
    "  async function sendPhoneCode() {",
    "  async function uploadPermit()",
    "",
    "SMS sending function"
)

replace_section(
    "  async function completeRegistration(phoneToken: string) {",
    "  if (auth.isLoaded",
    """  async function completeRegistration() {
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

""",
    "registration completion"
)

for line in [
    "    setSignupMethod('password');\n",
    "    setEmailVerified(false);\n",
    "    setCodeSent(false);\n",
    "    setSmsCode('');\n",
    "    setFirebaseIdToken('');\n",
    "    setPhoneVerifiedAt(0);\n",
]:
    if line in s:
        s = s.replace(line, "", 1)

replace_once(
    "      {accountType === 'individual' && <button type=\"button\" className=\"ma-google-signup\" onClick={() => void continueWithGoogle()} disabled={busy || !clerkLoaded} data-testid=\"button-signup-google\"><span className=\"ma-google-g\" aria-hidden=\"true\">G</span>{tr('Continue with Google', 'المتابعة باستخدام Google')}</button>}\n",
    "",
    "Google button"
)

replace_section(
    "    {step === 'phone' && <div className=\"ma-signup-form\"",
    "    {step === 'finishing' &&",
    "",
    "phone verification UI"
)

replace_once(
    "Your personal space opens after your email and phone are verified.",
    "Your personal space opens after your email is verified.",
    "finishing message"
)

if any(x in s for x in [
    "firebaseIdToken", "phoneVerifiedAt", "smsCode", "sendPhoneCode",
    "verifyPhoneAndRegister", "issuePhoneProof", "step === 'phone'",
    "useIssueRegistrationPhoneProof", "phone-verification",
    "SignupMethod", "continueWithGoogle", "marjea-phone-recaptcha"
]):
    raise RuntimeError("Phone-auth references remain. File was not written.")

if "firebaseIdToken:" in s:
    raise RuntimeError("firebaseIdToken remains in registration payload.")

p.write_text(s, encoding="utf-8")
print("SUCCESS: signup flow now uses email verification only.")
