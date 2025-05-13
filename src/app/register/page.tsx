import Register from '@/components/auth/register';

const RegisterPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-var(--header-height,4rem))] items-center justify-center bg-background p-4">
      <Register />
    </div>
  );
};

export default RegisterPage;
