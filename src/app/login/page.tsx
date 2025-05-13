import Login from '@/components/auth/login';

const LoginPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-var(--header-height,4rem))] items-center justify-center bg-background p-4">
      <Login />
    </div>
  );
};

export default LoginPage;
