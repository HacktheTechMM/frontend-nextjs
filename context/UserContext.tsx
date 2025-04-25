'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
    id: string;
    name: string;
    email: string;
    // add any other fields
};

type UserContextType = {
    user: User | null;
    loading: boolean;
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
};

const UserContext = createContext<UserContextType>({
    user: null,
    loading: true,
    token: null,
    setToken: () => { },
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // This code runs only on the client-side
        const storedUser = localStorage.getItem("USER");
        const storedToken = localStorage.getItem("token");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        if (storedToken) {
            setToken(storedToken);
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        if (!token) return;

        const fetchUser = async () => {
            try {
                const res = await fetch("/api/user", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("Unauthorized");
                const data = await res.json();
                localStorage.setItem("USER", JSON.stringify(data));
                setUser(data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, [token]);

    return (
        <UserContext.Provider value={{ user, loading, token, setToken }}>
            {children}
        </UserContext.Provider>
    );
};
