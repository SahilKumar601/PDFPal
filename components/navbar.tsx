import Link from "next/link";
import MaxWrapper from "./MaxWrapper";
import { buttonVariants } from "./ui/button";
import {RegisterLink, LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";
import { ArrowBigRightIcon } from "lucide-react";
const Navbar=()=>{
    return(
        <nav className="sticky inset-x-0 h-15 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
            <MaxWrapper>
                <div className="flex h-14 items-center justify-between border-b border-zinc-200">
                    <Link href='/' className="flex z-40 font-semibold">
                        <span>PDFPal.</span>
                    </Link>
                    <div className="hidden items-center space-x-4 sm:flex">
                        <>
                            <Link href='/pricing' className={buttonVariants({
                                variant:'ghost',
                                size:'sm',
                            })}>
                                Pricing
                            </Link>
                            <LoginLink className={buttonVariants({
                                variant:'ghost',
                                size:'sm',
                            
                            })}> Log In</LoginLink>
                            <RegisterLink className={buttonVariants({
                                size:'sm',
                                
                            })}> Get Started <ArrowBigRightIcon/></RegisterLink>
                        </>
                    </div>
                </div>
            </MaxWrapper>
        </nav>
    )
}

export default Navbar;