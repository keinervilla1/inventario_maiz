// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<{ password: string }>>({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout
            title="Confirma tu contraseña"
            description="Esta es un área segura. Por favor, confirma tu contraseña para continuar."
        >
            <Head title="Confirmar contraseña" />

            <form onSubmit={submit} className="space-y-10">
                <div className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            autoComplete="current-password"
                            value={data.password}
                            autoFocus
                            onChange={(e) => setData('password', e.target.value)}
                            className="focus:ring-[#5acafc] focus:border-[#5acafc]"
                        />

                        <InputError message={errors.password} />
                    </div>

                    <div className="pt-4">
                        <Button className="w-full bg-[#5acafc] hover:bg-[#3dbcea] text-white" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Confirmar contraseña
                        </Button>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
}
