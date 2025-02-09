import React from 'react'
import { Outlet } from 'react-router-dom';
import Layout from '../../component/Student/index'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const StudentLayout = () =>  {
    
    return(
        <QueryClientProvider client={queryClient}>
            <div>
                <Layout />
            </div>
        </QueryClientProvider>
    )
}

export default StudentLayout;