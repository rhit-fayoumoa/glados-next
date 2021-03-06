import React, {
	useState,
	useEffect,
	useContext,
	createContext,
	useDebugValue,
} from 'react';
import supabase from './client';

const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(supabase.auth.user() || null);
	const [loading, setLoading] = useState(false);
	console.log(user);
	useEffect(() => {
		const { data: authListener} = supabase.auth.onAuthStateChange((event, session) => {
			handleAuthChange(event, session);
			if (session) {
				setUser(session.user);
			} else {
				setUser(null);
			}
			setLoading(false);
		});

		return () => {
		    authListener.unsubscribe();
		};
	}, []);

	const handleAuthChange = async (event, session) => {
		await fetch('/api/auth', {
			method: 'POST',
			headers: new Headers({ 'Content-Type': 'application/json' }),
			credentials: 'same-origin',
			body: JSON.stringify({
				event,
				session,
			}),
		});
	};

	const authService = {
		signInWithEmailAndPassword: async (email, password) => {
			return await supabase.auth.signIn({ email: email, password: password });
		},
		signUpWithEmailAndPassword: async (email, password) => {
			return supabase.auth.signUp({
				email: email,
				password: password,
			});
		},
		signInWithGoogle: async () => {
			return supabase.auth.signIn({
				provider: 'google',
			});
		},
		signOut: async () => {
			return supabase.auth.signOut();
		},
	};

	useDebugValue(user);

	return (
		<AuthContext.Provider value={{ user, authService }}>
			{loading ? (
				<div>
					<h1>Loading...</h1>
				</div>
			) : (
				children
			)}
		</AuthContext.Provider>
	);
};
