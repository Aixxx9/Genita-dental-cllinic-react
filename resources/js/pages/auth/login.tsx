import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <AuthLayout
            title="Welcome Back to GENITA"
            description="Access your dental care dashboard"
        >
            <Head title="Log in">
                <style>{`
                    html, body {
                        overflow: hidden;
                        height: 100%;
                    }
                `}</style>
            </Head>

            {/* FORCE WHITE BACKGROUND */}
            <div className="fixed inset-0 z-0 bg-white"></div>

            {/* PERFECT CENTER */}
            <div className="fixed inset-0 z-10 flex items-center justify-center px-4">
                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex w-full max-w-md flex-col gap-6 rounded-2xl border border-purple-100 bg-white p-8 shadow-xl"
                >
                    {({ processing, errors }) => (
                        <>
                            {/* Header */}
                            <div className="text-center">
                                <h1 className="bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-3xl font-bold text-transparent">
                                    Staff Login
                                </h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Beautiful smiles start here
                                </p>
                            </div>

                            <div className="grid gap-5">
                                {/* Email */}
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-black"
                                    >
                                        Email address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                        className="rounded-xl border-black text-black focus:border-purple-500 focus:ring-purple-500"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                {/* Password */}
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label
                                            htmlFor="password"
                                            className="text-black"
                                        >
                                            Password
                                        </Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href={request()}
                                                className="ml-auto text-sm text-purple-600 hover:underline"
                                                tabIndex={5}
                                            >
                                                Forgot password?
                                            </TextLink>
                                        )}
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Password"
                                        className="rounded-xl border-black text-black focus:border-purple-500 focus:ring-purple-500"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                {/* Remember */}
                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                        className="border-purple-500 data-[state=checked]:bg-purple-600"
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="text-black"
                                    >
                                        Remember me
                                    </Label>
                                </div>

                                {/* Button */}
                                <Button
                                    type="submit"
                                    tabIndex={4}
                                    disabled={processing}
                                    data-test="login-button"
                                    className="mt-2 w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 font-semibold text-white shadow-lg hover:opacity-90"
                                >
                                    {processing && <Spinner />}
                                    Log in
                                </Button>
                            </div>

                            {/* Register */}
                            {canRegister && (
                                <div className="text-center text-sm text-gray-500">
                                    Don't have an account?{' '}
                                    <TextLink
                                        href={register()}
                                        tabIndex={5}
                                        className="font-medium text-purple-600 hover:underline"
                                    >
                                        Sign up
                                    </TextLink>
                                </div>
                            )}
                        </>
                    )}
                </Form>

                {/* Status */}
                {status && (
                    <div className="absolute bottom-6 text-center text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}
            </div>
        </AuthLayout>
    );
}
