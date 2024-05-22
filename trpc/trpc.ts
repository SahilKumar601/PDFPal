import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { TRPCError, initTRPC } from '@trpc/server';
const t = initTRPC.create();
const middleware = t.middleware;
const isauth = middleware(async(opts)=>{
    const {getUser} = getKindeServerSession();
    const User = await getUser();
    if(!User || !User.id){
        throw new TRPCError({code:'UNAUTHORIZED'})
    }
    return opts.next({
        ctx:{
            userId: User.id,
            User,
        },
    })
})
export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isauth);