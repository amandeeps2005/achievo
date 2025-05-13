import ResetPassword from '@/components/auth/reset-password';

const ResetPasswordPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-var(--header-height,4rem))] items-center justify-center bg-background p-4">
      <ResetPassword />
    </div>
  );
};

export default ResetPasswordPage;
