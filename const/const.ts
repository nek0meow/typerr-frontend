const AppRoute = {
    Main: "/",
    Login: "/login",
    Register: "/register",
    NotFound: "/404",
    Profile: "/profile"
} as const;

const AuthorizationStatus = {
    NoAuth: "NO_AUTH",
    Auth: "AUTH"
} as const;

type AppRoute = (typeof AppRoute)[keyof typeof AppRoute];
type AuthorizationStatus = (typeof AuthorizationStatus)[keyof typeof AuthorizationStatus];

const API_HOST = 'http://localhost:8090/api'

export { AuthorizationStatus, AppRoute, API_HOST };
