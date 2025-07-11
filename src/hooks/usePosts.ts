import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../components/Random";

export const usePosts = () => useQuery({
    queryKey: ['posts'],
    queryFn: getPosts
})