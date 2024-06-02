import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import {PDFLoader} from 'langchain/document_loaders/fs/pdf'
import {OpenAIEmbeddings} from '@langchain/openai'
import {RecursiveCharacterTextSplitter} from 'langchain/text_splitter'
import {PineconeStore} from '@langchain/pinecone'
import {pinecone} from '@/lib/pinecone'



const f = createUploadthing();
export const ourFileRouter = {
  PdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
        const {getUser} = getKindeServerSession();
        const user= await getUser();
        if(!user || !user.id) throw new Error('Unauthorized');
        return{userId: user.id}
    })
    .onUploadComplete(async ({ metadata, file }) => {
        const createFile = await db.file.create({
          data:{
            key:file.key,
            name:file.name,
            userId:metadata.userId,
            url:`${file.url}`,
            uploadstatus:'PROCESSING',
          },
        })
        async function getChunkedDocsFromPDF() {
          try {
            const response = await fetch(file.url);
            const blob = await response.blob()
            const loader = new PDFLoader(blob) 
            const docs = await loader.load();
            const textSplitter = new RecursiveCharacterTextSplitter({
              chunkSize: 1000,
              chunkOverlap: 200,
            });
            const chunkedDocs = await textSplitter.splitDocuments(docs);
            return chunkedDocs;
          } catch (e) {
            console.error(e);
            throw new Error("PDF docs chunking failed !");
          }
        }
        const fileId = file.key
        try {
          const response = await fetch(file.url);
          const blob = await response.blob()
          const loader = new PDFLoader(blob)  
          const pageLevelDocs= await getChunkedDocsFromPDF();
          const pageAmt = pageLevelDocs.length
          console.log(pageAmt)

          const pineconeIndex = pinecone.Index("pdfbot")
          console.log('Index Done')
          console.log(process.env.OPENAI_APIKEY!)
          const embeddings = new OpenAIEmbeddings({
            openAIApiKey:process.env.OPENAI_APIKEY!,
          })
          console.log('embeddings Done')
          try{
          await PineconeStore.fromDocuments(pageLevelDocs, embeddings,{
            pineconeIndex,
            textKey:fileId,
          })
            console.log('file stored successfully')
          }
          catch(err){
            console.log(err)
          }
          await db.file.update({
            data:{
              uploadstatus:'SUCCESS'
            },
            where:{
              id:fileId
            }
          })
        } catch (error) {
            await db.file.update({
              data:{
                uploadstatus:'FAILED'
              },
              where:{
                id:fileId
              }             
            })
        }
    }),

} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;