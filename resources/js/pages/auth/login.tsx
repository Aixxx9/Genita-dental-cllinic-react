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

const loadingWordmarkLines = ['GENITA DENTAL', 'CLINIC'];

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

                    @keyframes wordmark-letter-fade {
                        0% {
                            opacity: 0;
                            transform: translateY(14px) scale(0.96);
                            filter: blur(5px);
                        }
                        100% {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                            filter: blur(0);
                        }
                    }

                    @keyframes wordmark-slide-left {
                        0%, 72% {
                            transform: translateX(0);
                            opacity: 1;
                        }
                        100% {
                            transform: translateX(-120px);
                            opacity: 0;
                        }
                    }

                    @keyframes loading-line {
                        0% {
                            transform: translateX(-100%);
                        }
                        100% {
                            transform: translateX(220%);
                        }
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
                            {processing && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-white/95 backdrop-blur-sm">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(147,51,234,0.18),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(99,102,241,0.18),_transparent_40%)]" />

                                    <div className="relative flex w-full max-w-3xl flex-col items-center gap-8 px-6 text-center">
                                        <div
                                            className="flex flex-col items-center gap-3 text-3xl font-semibold uppercase tracking-[0.32em] text-slate-900 sm:text-5xl"
                                            style={{
                                                animation:
                                                    'wordmark-slide-left 3.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                                            }}
                                        >
                                            {loadingWordmarkLines.map(
                                                (line, lineIndex) => {
                                                    const letterOffset =
                                                        loadingWordmarkLines
                                                            .slice(0, lineIndex)
                                                            .join('').length +
                                                        lineIndex;

                                                    return (
                                                        <div
                                                            key={line}
                                                            className="flex items-center justify-center"
                                                        >
                                                            {line.split('').map(
                                                                (
                                                                    letter,
                                                                    letterIndex,
                                                                ) =>
                                                                    letter ===
                                                                    ' ' ? (
                                                                        <span
                                                                            key={`space-${lineIndex}-${letterIndex}`}
                                                                            className="w-4 sm:w-6"
                                                                            aria-hidden="true"
                                                                        />
                                                                    ) : (
                                                                        <span
                                                                            key={`${letter}-${lineIndex}-${letterIndex}`}
                                                                            className="inline-block opacity-0"
                                                                            style={{
                                                                                animation:
                                                                                    'wordmark-letter-fade 0.45s ease-out forwards',
                                                                                animationDelay: `${(letterOffset + letterIndex) * 0.08}s`,
                                                                            }}
                                                                        >
                                                                            {letter}
                                                                        </span>
                                                                    ),
                                                            )}
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <p className="text-sm font-medium uppercase tracking-[0.35em] text-purple-700">
                                                Loading
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Preparing your dashboard...
                                            </p>
                                        </div>

                                        <div className="relative h-1.5 w-full max-w-md overflow-hidden rounded-full bg-purple-100">
                                            <div
                                                className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-400"
                                                style={{
                                                    animation:
                                                        'loading-line 1.15s ease-in-out infinite',
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

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
