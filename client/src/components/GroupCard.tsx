import { Group } from "@shared/schema";
import { Calendar, MapPin, User, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface GroupCardProps {
  group: Group;
  index: number;
}

export function GroupCard({ group, index }: GroupCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative flex flex-col bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-accent/30 transition-all duration-300 overflow-hidden"
    >
      {/* Decorative top bar */}
      <div className="h-2 w-full bg-gradient-to-r from-primary to-primary/80" />

      <div className="p-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-heading text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {group.name}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <User className="h-3 w-3 mr-1.5 text-accent" />
              <span>Led by {group.leader}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
          {group.description}
        </p>

        {/* Details Grid */}
        <div className="mt-auto space-y-3 pt-6 border-t border-border/50">
          <div className="flex items-start text-sm text-foreground/80">
            <Calendar className="h-4 w-4 mr-2.5 text-primary shrink-0 mt-0.5" />
            <span>{group.schedule}</span>
          </div>
          <div className="flex items-start text-sm text-foreground/80">
            <MapPin className="h-4 w-4 mr-2.5 text-primary shrink-0 mt-0.5" />
            <span>{group.location}</span>
          </div>
          {group.capacity && (
            <div className="flex items-center text-sm text-foreground/80">
              <Users className="h-4 w-4 mr-2.5 text-primary shrink-0" />
              <span>Capacity: {group.capacity} members</span>
            </div>
          )}
        </div>
        
        <Button className="w-full mt-6 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium">
          Request to Join
        </Button>
      </div>
    </motion.div>
  );
}
