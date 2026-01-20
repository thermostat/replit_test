import { useGroups } from "@/hooks/use-groups";
import { Layout } from "@/components/Layout";
import { GroupCard } from "@/components/GroupCard";
import { Loader2, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Home() {
  const { data: groups, isLoading, error } = useGroups();
  const [search, setSearch] = useState("");

  const filteredGroups = groups?.filter(group => 
    group.name.toLowerCase().includes(search.toLowerCase()) || 
    group.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-primary overflow-hidden">
        {/* Abstract pattern background */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 py-24 sm:py-32 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Find Your Circle
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-primary-foreground/90 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Connect with your community through small groups centered around shared interests, learning, and service.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-16 -mt-10">
        
        {/* Search Bar Card */}
        <div className="bg-card rounded-xl shadow-lg border border-border/50 p-6 mb-12 max-w-4xl mx-auto relative z-20">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search by name or interest..." 
              className="pl-10 h-12 text-lg bg-background border-border hover:border-primary/50 focus:border-primary transition-colors rounded-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Content State Handling */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Gathering circles...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-destructive/5 rounded-2xl border border-destructive/20">
            <p className="text-destructive font-semibold text-lg">Unable to load circles at this time.</p>
            <p className="text-muted-foreground mt-2">Please try again later.</p>
          </div>
        ) : filteredGroups?.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-muted mb-6">
              <Search className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-foreground">No circles found</h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              We couldn't find any circles matching "{search}". Try a different search term or start your own circle!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGroups?.map((group, index) => (
              <GroupCard key={group.id} group={group} index={index} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
