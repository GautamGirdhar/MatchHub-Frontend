"use client"

import React, { useState, useEffect } from "react"
import { Poppins, Inter } from 'next/font/google';
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Shield, Brain, MessageCircle, Lock, CheckCircle } from "lucide-react"

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});


interface Feature {
  id: string
  icon: React.ElementType
  emoji: string
  title: string
  description: string
  color: string
  bgColor: string
}

interface CollegeFeaturesProps {
  features?: Feature[]
  className?: string
  title?: string
  subtitle?: string
  autoPlayInterval?: number
}

const defaultFeatures: Feature[] = [
  {
    id: "verified",
    icon: Shield,
    emoji: "🎓",
    title: "Verified Campus Profiles",
    description: "Real students only - connect with verified college peers in a trusted environment",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30"
  },
  {
    id: "smart-match",
    icon: Brain,
    emoji: "🧠",
    title: "Smart Match System",
    description: "Find your perfect match based on interests, course, and year - because compatibility matters",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30"
  },
  {
    id: "community",
    icon: MessageCircle,
    emoji: "💬",
    title: "Safe & Respectful Community",
    description: "Built-in report and block system to ensure a positive, respectful dating experience",
    color: "text-pink-600",
    bgColor: "bg-pink-50 dark:bg-pink-950/30"
  },
  {
    id: "privacy",
    icon: Lock,
    emoji: "🔒",
    title: "Privacy First",
    description: "No random outsiders - your campus, your community, your privacy protected",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30"
  }
]

export default function Features({
  features = defaultFeatures,
  className,
  title = "Why Students Love Us",
  subtitle = "The safest and smartest way to find your college match",
  autoPlayInterval = 4000
}: CollegeFeaturesProps) {
  const [activeFeature, setActiveFeature] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (autoPlayInterval / 100))
      } else {
        setActiveFeature((prev) => (prev + 1) % features.length)
        setProgress(0)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [progress, features.length, autoPlayInterval])

  return (
    <section className={cn("py-16 sm:py-24 bg-background", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`${poppins.className} text-center max-w-3xl mx-auto mb-12 sm:mb-16`}>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Desktop: Side by Side Layout */}
        <div className={`${inter.className} hidden lg:grid lg:grid-cols-2 gap-12 items-center`}>
          {/* Left: Feature List */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                className={cn(
                  "relative cursor-pointer rounded-xl p-6 transition-all duration-300",
                  index === activeFeature
                    ? "bg-card shadow-lg border-2 border-primary"
                    : "bg-card/50 border border-border hover:bg-card hover:shadow-md"
                )}
                onClick={() => {
                  setActiveFeature(index)
                  setProgress(0)
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl",
                    index === activeFeature ? feature.bgColor : "bg-muted"
                  )}>
                    {feature.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                      {feature.title}
                      {index === activeFeature && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
                {index === activeFeature && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-primary rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Right: Animated Feature Showcase */}
          <div className="relative h-[500px] rounded-2xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-8 flex items-center justify-center overflow-hidden border border-border">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: 20 }}
                transition={{ duration: 0.5 }}
              >
                <div className={cn(
                  "w-32 h-32 mx-auto rounded-full flex items-center justify-center text-6xl mb-6",
                  features[activeFeature].bgColor
                )}>
                  {features[activeFeature].emoji}
                </div>
                <h3 className="text-3xl font-bold mb-4">
                  {features[activeFeature].title}
                </h3>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  {features[activeFeature].description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-secondary/10 blur-3xl" />
          </div>
        </div>

        {/* Mobile & Tablet: Card Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:hidden">
          {features.map((feature, index) => (
            <Card
              key={feature.id}
              className="flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-primary/50"
            >
              <CardHeader className="pb-3">
                <div className={cn(
                  "mb-3 p-3 w-fit rounded-lg text-3xl",
                  feature.bgColor
                )}>
                  {feature.emoji}
                </div>
                <CardTitle className="text-xl font-semibold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}