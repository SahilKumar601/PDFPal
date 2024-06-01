import { createContext, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { threadId } from "worker_threads";

type StreamResponse = {
    addMessage: void,
    message:string,
    handleChange: (event:React.ChangeEvent<HTMLTextAreaElement>)=>void,
    isLoading:boolean
}

export const ChatContext = createContext({
    addMessage: ()=>{},
    message:"",
    handleChange: ()=>{},
    isLoading:false
})  

interface Props{
    fileId:string;
    children:React.ReactNode

}

export const ChatContextProvider=({fileId,children}:Props)=>{
    const [message,setMessage] = useState<string>("");
    const [isLoading,setIsLoading] = useState<boolean>(false)
    const {toast} = useToast()
    const {mutate:sendMessage} = useMutation({
        mutationFn:async({message}:{message:string})=>{
            const response = await fetch('/api/message',{
                method:'POST',  
                body:JSON.stringify({
                    fileId,
                    message,
                }),
            })
            if(!response.ok){
                throw new Error("Failed to send message")
            }
            return response.body
        }
    })
    const handleChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {setMessage(e.target.value)}
    const addMessage = () =>sendMessage({message})
    return(
        <ChatContext.Provider 
            value={{
                addMessage,
                message,
                handleChange,
                isLoading,  
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}