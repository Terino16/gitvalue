"use client";
import React, {  useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import ShowCard from "./ShowCard";
import { fetchDataForAllYears } from "@/lib/getContribution";
import gifLoading from "../../public/typingGif.gif";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameSchema } from "@/lib/usernamevalidate";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import Link from "next/link";

const InputForm = () => {
  const [data, setData] = useState({});
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  function calculateGitHubWorth(
    contributions: number,
    followers: number,
    stars: number
  ) {

    const contributionWeight = 0.7;
    const followerWeight = 0.3;
    const starWeight = 0.5;


    const estimatedWorth =
      contributions * contributionWeight +
      followers * followerWeight +
      stars * starWeight;

    return estimatedWorth.toFixed(1);
  }

  const form = useForm<z.infer<typeof usernameSchema>>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: "",
    },
  });

  const getGithubData = async (values: z.infer<typeof usernameSchema>) => {
    setLoading(true);
    try {
      if (values.username === "") return;
      const myUsername : string = values.username.includes("@") ? values.username.replace('@', '') : values.username
      const data = await fetch(
        `https://api.github.com/users/${myUsername}`
      );
      const finalData = await data.json();
      
        if(finalData?.message === 'Not Found'){
          form.reset()
          return toast.error('Sorry, No Username Found !' ,{  style: {
            background: 'crimson', color: 'white'
          }, position: 'top-center'})
        }else if(finalData?.type === "Organization"){
          form.reset()
          return toast.error('Sorry, Organisation username not allowed!' ,{  style: {
            background: 'crimson', color: 'white'
          }, position: 'top-center'})
        }
      const getStar = await fetch(
        `https://api.github.com/users/${myUsername}/repos?per_page=1000`
      );
      const storeStars: Array<any> = await getStar.json();
      // Calculate the total stars
      if (Array.isArray(storeStars)) {
        const totalStars = storeStars.reduce(
          (acc: any, repo: any) => acc + repo.stargazers_count,
          0
        );

        const hereis = await fetchDataForAllYears(myUsername);


        const createData = {
          avatar: finalData.avatar_url,
          fullname: finalData.name,
          username: finalData.login,
          followers: finalData.followers || 0,
          stars: totalStars || 0,
          contribuitions: hereis.total,
          estimated: calculateGitHubWorth(
            hereis.total,
            finalData.followers,
            totalStars
          ),
        };
        setData(createData);
        
        setGenerated(true);
      }
    } catch (error) {
      console.log(error);
      toast.error('Rate Limit Reached! Try after some time' ,{  style: {
        background: 'crimson', color: 'white'
      }, position: 'top-center'})
    }finally{
      setLoading(false);
    }
  };


 
 
  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        <div className="p-3 flex flex-col gap-3 items-center justify-center ">
          <Image
            src={gifLoading}
            alt="loading"
            height={200}
            width={300}
            loading="eager"
            priority
            className="rounded-md"
          />
          <span className="text-xl sm:text-2xl text-primary font-medium">
        
            Please wait calculating your worth ...
          </span>
        </div>
      ) : (
        
        generated ? (
              <ShowCard {...data} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Let&#39;s see your Github worth</CardTitle>
                  <CardDescription>
                    Enter your valid github username below.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(getGithubData)}
                      className="space-y-8"
                    >
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="username"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button className="w-full" type="submit">
                        Generate Worth
                      </Button>
                    </form>
                  </Form>
                    
                </CardContent>
                </Card>
            )
            
            
            
            )}
    </div>
  );
};

export default InputForm;