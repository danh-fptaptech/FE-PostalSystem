import {NextResponse} from 'next/server';
import {withAuth} from 'next-auth/middleware';

const url = process.env.NEXT_PUBLIC_API_URL

export default withAuth(
    // `withAuth` augments your `Request` with the user's token.
    async function middleware(req) {
        const token = req.nextauth.token;

        if (token) {
            const pathname = req.nextUrl.pathname;

            const dynamicPaths = ['[id]', '[token]'];
            // Find a matching path with dynamic path handling
            const path = paths.find(p => {
                if (dynamicPaths.some(dp => p.path.includes(dp))) {
                    const regex = new RegExp(p.path.replace(/\[.*?\]/g, '.*'));

                    return regex.test(pathname);
                }

                return p.path === pathname;
            });

            if (!path) {
                return NextResponse.redirect(new URL('/', req.url));
            }

            const userPermissions = token.role.permissions || [];
            const hasPermission = path.permission.some(p =>
                userPermissions.includes(p)
            );

            if (!hasPermission) {
                return NextResponse.redirect(new URL('/access-denied', req.url));
            }else {

                console.log(hasPermission);
            }

            return NextResponse.next();
        } else {
            if (
                req.nextUrl.pathname === '/login' ||
                req.nextUrl.pathname === '/employee-login' ||
                req.nextUrl.pathname === '/admin-login'
            )
                return NextResponse.next();
            else if (
                req.nextUrl.pathname.startsWith('/app') ||
                req.nextUrl.pathname.startsWith('/app/employee') ||
                req.nextUrl.pathname.startsWith('/app/admin/employees')
            ) {
                return NextResponse.redirect(new URL('/', req.url));
            }
        }
    },
    {
        callbacks: {
            authorized: async ({token}) => {
                return true;
            },
        },
    }
);

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|auth/|access-denied|forgot-password|reset-password|register|$).*)',
    ],
};

const paths = [
    {
        path: '/tracking-shipment',
        permission: ['app.view'],
    },
    {
        path: '/estimate-cost',
        permission: ['app.view'],
    },
    {
        path: '/news',
        permission: ['app.view'],
    },
    {
        path: '/news/[id]',
        permission: ['app.view'],
    },
    {
        path: '/app',
        permission: ['app.view'],
    },
    {
        path: '/app/user',
        permission: ['user.view', 'User'],
    },
    {
        path: '/app/user/change-password',
        permission: ['password.change'],
    },
    {
        path: '/app/user/packages',
        permission: ['packages.view'],
    },
    {
        path: '/app/user/create-package',
        permission: ['package.create'],
    },
    {
        path: '/app/user/add-address',
        permission: ['address.create'],
    },
    {
        path: '/app/user/addresses/receiver',
        permission: ['addresses.view'],
    },
    {
        path: '/app/user/addresses/sender',
        permission: ['addresses.view'],
    },
    {
        path: '/app/user/addresses',
        permission: ['addresses.view'],
    },
    {
        path: '/app/admin/users',
        permission: ['Admin'],
    },
    {
        path: '/app/admin/employees',
        permission: ['Admin', 'Branch Manager'],
    },
    {
        path: '/app/admin/roles',
        permission: ['Admin'],
    },
    {
        path: '/app/admin/requests',
        permission: ['Admin'],
    },

    {
        path: '/app/admin/users',
        permission: ['Admin'],
    },

    {
        path: '/app/packages',
        permission: ['user.access', 'Employee', 'Branch Manager', 'Admin'],
    },

    {
        path: '/app/employee',
        permission: ['user.access', 'Employee', 'Branch Manager', 'Delivery'],
    },
    {
        path: '/app/historylogs',
        permission: [
            'user.access',
            'Employee',
            'Branch Manager',
            'Delivery',
            'Warehouse',
        ],
    },
    {
        path: '/app/branches',
        permission: ['branches.view'],
    },
    {
        path: '/app/create-package',
        permission: ['Admin','user.view'],
    },
    {
        path:'/app/news-management',
        permission: ['app.view'],
    },
    {
        path:'/app/news-management/create',
        permission: ['app.view'],
    },
    {
        path: '/app/news-management/update/[id]',
        permission: ['app.view'],
    },
    {
        path: '/app/news-management/delete',
        permission: ['app.view']
    },
    {
        path:'/app/general-settings',
        permission: ['app.view']
    }
]
