import ProtectedRoute from '../components/ProtectedRoute';
import '../styles/globals.css';
import { AuthProvider } from '../supabase/auth';

const noAuthRequired = ['/', '/auth'];

function MyApp({ Component, pageProps, router }) {
	return (
		<AuthProvider>
			{noAuthRequired.includes(router.pathname) ? (
				<Component {...pageProps} key={router.route} />
			) : (
				<ProtectedRoute>
					<Component {...pageProps} key={router.route} />
				</ProtectedRoute>
			)}
		</AuthProvider>
	);
}

export default MyApp;
