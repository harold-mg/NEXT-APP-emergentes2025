export async function login(ci: string, password: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ci, password }),
    });

    if (!res.ok) {
        throw new Error("Credenciales incorrectas");
    }

    return await res.json(); // Retorna el token
}

export async function getUsuarios() {
    const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/usuarios`, {
        cache: "no-store",
    });
    return await data.json();
}

export async function getUsuario(id: string) {
    console.log("ID enviado al backend:", id);
    const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/usuarios/${id}`, {
        cache: "no-store",
    });
    return await data.json();
}

export async function createUsuario(usuarioData: any) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/usuarios`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioData),
    });
    const data = await res.json();
    console.log(data);
}

export async function deleteUsuario(id: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/usuarios/${id}`, {
        method: 'DELETE',
    });
    return await res.json();
}

export async function updateUsuario(id: string, newUsuario: any) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/usuarios/${id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUsuario),
        cache: 'no-store',
    });
    return await res.json();
}
