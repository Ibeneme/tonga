import { Scooter, formatCurrency } from "@/lib/booking";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Check } from "lucide-react";
import { Link } from "react-router-dom";

interface ScooterCardProps {
  scooter: Scooter;
  showBookButton?: boolean;
}

export const ScooterCard = ({
  scooter,
  showBookButton = true,
}: ScooterCardProps) => {
  const isAvailable = scooter.available > 0;

  return (
    <Card className="overflow-hidden shadow-card hover:shadow-elevated transition-shadow duration-300 group">
      <CardHeader className="p-0">
        <div className="h-48 bg-gradient-to-br from-ocean/20 to-ocean/5 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-center bg-cover opacity-10" />
          <div className="relative z-10 text-center">
            <div className="w-24 h-24 mx-auto mb-2 bg-gradient-ocean rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users className="w-12 h-12 text-primary-foreground" />
            </div>
            <Badge
              variant={isAvailable ? "default" : "secondary"}
              className="font-medium"
            >
              {isAvailable ? `${scooter.available} available` : "Coming Soon"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="font-display text-xl font-bold">{scooter.name}</h3>
          <p className="text-muted-foreground text-sm mt-1">
            {scooter.description}
          </p>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl font-bold text-primary">
            {formatCurrency(scooter.pricePerDay, scooter.priceCurrency)}
          </span>
          <span className="text-muted-foreground text-sm">/ day</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {scooter.capacity} rider{scooter.capacity > 1 ? "s" : ""}
          </span>
        </div>

        <ul className="space-y-2">
          {scooter.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-palm" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      {showBookButton && (
        <CardFooter className="p-6 pt-0">
          <Button
            variant={isAvailable ? "hero" : "secondary"}
            className="w-full"
            size="lg"
            disabled={!isAvailable}
            asChild={isAvailable}
          >
            {isAvailable ? (
              <Link to={`/book?type=${scooter.type}`}>Book This Scooter</Link>
            ) : (
              <span>Coming Soon</span>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
