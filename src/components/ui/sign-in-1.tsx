import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Web3Login from "../Web3Login";
import TelegramLogin from "../TelegramLogin";

/**
 * Props for the AuthForm component.
 */
interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The source URL or base64 string for the company logo.
   */
  logoSrc: string;
  /**
   * Alt text for the company logo for accessibility.
   */
  logoAlt?: string;
  /**
   * The main title of the form.
   */
  title: string;
  /**
   * A short description or subtitle displayed below the title.
   */
  description?: string;
  /**
   * The primary call-to-action button (e.g., social login).
   */
  primaryAction: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };
  /**
   * An array of secondary action buttons.
   */
  secondaryActions?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  }[];
  /**
   * An optional action for skipping the login process.
   */
  skipAction?: {
    label: string;
    onClick: () => void;
  };
  /**
   * Custom content to be displayed in the footer area.
   */
  footerContent?: React.ReactNode;
}

/**
 * A reusable authentication form component built with shadcn/ui.
 * It supports various providers, a customizable header, and animations.
 */
const AuthForm = React.forwardRef<HTMLDivElement, AuthFormProps>(
  (
    {
      className,
      logoSrc,
      logoAlt = "Company Logo",
      title,
      description,
      primaryAction,
      secondaryActions,
      skipAction,
      footerContent,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("flex flex-col items-center justify-center", className)}>
        <Card
          ref={ref}
          className={cn(
            "w-full max-w-sm",
            // Entrance Animation from tailwindcss-animate
            "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-500 bg-[oklch(20.5%_0_0)] border border-[color:oklch(100%_0_0_/_0.1)]"
          )}
          {...props}
        >
          <CardHeader className="text-center">
            {/* Logo rendered from src */}
            {/* <div className="mb-4 flex justify-center">
              <img src={logoSrc} alt={logoAlt} className="h-12 w-12 object-contain rounded-[4px]" />
            </div> */}
            <CardTitle className="text-2xl font-semibold tracking-tight">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
          <CardContent className="grid gap-2">
            {/* Primary Action Button */}
            <Button onClick={primaryAction.onClick} className="bg-[#2a2a2a] hover:bg-white hover:text-black w-full transition-transform hover:scale-[1.03]">
              {primaryAction.icon}
              {primaryAction.label}
            </Button>           

            {/* Secondary Action Buttons */}
            <div className="grid gap-2">
            {/* {secondaryActions?.map((action, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-orange-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md transform scale-90 animate-pulse">
                      SOON
                    </div>
                  </div>
                  
                  <Button 
                    variant="secondary" 
                    className="bg-[#2a2a2a] hover:bg-[#2a2a2a] cursor-not-allowed relative w-full transition-none pr-8" 
                    disabled
                    onClick={action.onClick}  // Keep for accessibility
                  >
                    <div className="flex items-center gap-2">
                      {action.icon}
                      <span>{action.label}</span>
                    </div>
                  </Button>
                </div>
              ))} */}
              <TelegramLogin/>
              <Web3Login/>
            </div>
            {/* <div className="grid gap-2">
              <TelegramLogin/>
              <Web3Login/>
            </div> */}
          </CardContent>

          {/* Skip Action Button */}
          {skipAction && (
            <CardFooter className="flex flex-col">
              <Button variant="outline" className="w-full transition-transform hover:scale-[1.03]" onClick={skipAction.onClick}>
                {skipAction.label}
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Footer */}
        {footerContent && (
          <div className="mt-6 w-full max-w-sm px-8 text-center text-sm text-muted-foreground animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-500 [animation-delay:200ms]">
            {footerContent}
          </div>
        )}
      </div>
    );
  }
);
AuthForm.displayName = "AuthForm";

export { AuthForm };