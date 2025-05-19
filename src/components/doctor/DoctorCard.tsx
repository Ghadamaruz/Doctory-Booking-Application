import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { MapPin, Star, Calendar, User } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DoctorCardProps {
  id: string;
  name: string;
  specialty: string;
  address?: string;
  distance?: string;
  availability?: string;
  rating?: number;
  reviews?: number;
  image?: string;
  className?: string;
  layout?: "grid" | "list";
}

export function DoctorCard({
  id,
  name,
  specialty,
  address,
  distance,
  availability,
  rating = 0,
  reviews = 0,
  image,
  className = "",
  layout = "list"
}: DoctorCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleCardClick = () => {
    navigate(`/patient/doctor/${id}`);
  };

  const handleButtonClick = (e: React.MouseEvent, action: "book" | "view") => {
    e.stopPropagation();
    navigate(`/patient/doctor/${id}${action === "book" ? "?action=book" : ""}`);
  };

  // Render stars based on rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-yellow-400" />
          <div className="absolute top-0 left-0 w-[50%] overflow-hidden">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <Card
      className={`${className} hover:shadow-md transition-shadow cursor-pointer border-primary/10`}
      onClick={handleCardClick}
    >
      <CardContent className={`p-4 ${layout === "grid" ? "flex flex-col items-center text-center" : "flex items-start gap-4"}`}>
        <Avatar className={`${layout === "grid" ? "w-20 h-20 mb-3" : "w-16 h-16"} border-2 border-primary/10`}>
          {image ? (
            <img src={image} alt={name} className="object-cover" />
          ) : (
            <User className="h-8 w-8 text-muted-foreground" />
          )}
        </Avatar>

        <div className={`${layout === "grid" ? "w-full" : "flex-1"}`}>
          <h3 className="text-lg font-semibold line-clamp-1">{name}</h3>
          <p className="text-muted-foreground line-clamp-1">{specialty}</p>

          {address && (
            <div className={`flex ${layout === "grid" ? "justify-center" : ""} items-center space-x-1 mt-1`}>
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{address}{distance && ` - ${distance}`}</span>
            </div>
          )}

          <div className={`flex ${layout === "grid" ? "justify-center" : ""} items-center space-x-1 mt-1`}>
            <div className="flex">{renderStars()}</div>
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            {reviews > 0 && (
              <span className="text-sm text-muted-foreground">({reviews})</span>
            )}
          </div>

          {availability && (
            <p className="text-sm text-green-500 mt-1">{availability}</p>
          )}
        </div>

        <div className={`flex ${layout === "grid" ? "w-full mt-3 justify-center" : "flex-col"} gap-2`}>
          <Button
            size="sm"
            onClick={(e) => handleButtonClick(e, "book")}
            className={layout === "grid" ? "w-full" : ""}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {t("bookAppointment")}
          </Button>
          {layout === "list" && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => handleButtonClick(e, "view")}
            >
              <User className="mr-2 h-4 w-4" />
              {t("viewProfile")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
