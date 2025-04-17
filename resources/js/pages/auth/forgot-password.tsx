// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthLayout title="¿Olvidaste tu contraseña?" description="Ingresa tu correo para recibir un enlace de recuperación">
            <Head title="Recuperar contraseña" />

            {status && <div className="mb-4 text-center text-sm font-medium text-[#5acafc]">{status}</div>}

            <div className="space-y-10">
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="off"
                            value={data.email}
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="correo@ejemplo.com"
                            className="focus:ring-[#5acafc] focus:border-[#5acafc]"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="pt-4">
                        <Button className="w-full bg-[#5acafc] hover:bg-[#3dbcea] text-white" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Enviar enlace de recuperación
                        </Button>
                    </div>
                </form>

                <div className="text-muted-foreground space-x-1 text-center text-sm">
                    <span>O vuelve al</span>
                    <TextLink href={route('login')} className="text-[#5acafc] hover:underline">inicio de sesión</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}