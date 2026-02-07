 import { useState } from "react";
 import { motion } from "framer-motion";
 import { useForm } from "react-hook-form";
 import { zodResolver } from "@hookform/resolvers/zod";
 import { z } from "zod";
 import { MapPin, Phone, Mail, Clock, Send, MessageSquare, AlertCircle } from "lucide-react";
 import Navbar from "@/components/layout/Navbar";
 import Footer from "@/components/layout/Footer";
 import FlashNewsTicker from "@/components/interactive/FlashNewsTicker";
 import WhatsAppBubble from "@/components/interactive/WhatsAppBubble";
 import SEOHead from "@/components/SEOHead";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Textarea } from "@/components/ui/textarea";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import { useToast } from "@/hooks/use-toast";
 
 const contactSchema = z.object({
   name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
   email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
   phone: z.string().trim().min(10, "Please enter a valid phone number").max(15, "Phone number is too long"),
   subject: z.string().trim().min(5, "Subject must be at least 5 characters").max(200, "Subject must be less than 200 characters"),
   message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters"),
 });
 
 const feedbackSchema = z.object({
   name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
   email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
   issueType: z.string().trim().min(1, "Please select an issue type"),
   description: z.string().trim().min(20, "Please provide more details (at least 20 characters)").max(1000, "Description must be less than 1000 characters"),
 });
 
 type ContactFormData = z.infer<typeof contactSchema>;
 type FeedbackFormData = z.infer<typeof feedbackSchema>;
 
 const Contact = () => {
   const { toast } = useToast();
   const [isContactSubmitting, setIsContactSubmitting] = useState(false);
   const [isFeedbackSubmitting, setIsFeedbackSubmitting] = useState(false);
 
   const contactForm = useForm<ContactFormData>({
     resolver: zodResolver(contactSchema),
     defaultValues: {
       name: "",
       email: "",
       phone: "",
       subject: "",
       message: "",
     },
   });
 
   const feedbackForm = useForm<FeedbackFormData>({
     resolver: zodResolver(feedbackSchema),
     defaultValues: {
       name: "",
       email: "",
       issueType: "",
       description: "",
     },
   });
 
   const onContactSubmit = async (data: ContactFormData) => {
     setIsContactSubmitting(true);
     // Simulate API call
     await new Promise((resolve) => setTimeout(resolve, 1500));
     setIsContactSubmitting(false);
     
     toast({
       title: "Message Sent! 🙏",
       description: "Thank you for reaching out. We'll get back to you within 24 hours.",
     });
     contactForm.reset();
   };
 
   const onFeedbackSubmit = async (data: FeedbackFormData) => {
     setIsFeedbackSubmitting(true);
     // Simulate API call
     await new Promise((resolve) => setTimeout(resolve, 1500));
     setIsFeedbackSubmitting(false);
     
     toast({
       title: "Feedback Received! 🙏",
       description: "Thank you for your feedback. We appreciate you helping us improve.",
     });
     feedbackForm.reset();
   };
 
   const contactInfo = [
     {
       icon: MapPin,
       title: "Visit Us",
       details: ["Inner Peace Yoga Studio", "123 Serenity Lane, Wellness District", "Bangalore, Karnataka 560001"],
     },
     {
       icon: Phone,
       title: "Call Us",
       details: ["+91 98765 43210", "+91 80 1234 5678"],
     },
     {
       icon: Mail,
       title: "Email Us",
       details: ["info@innerpeaceyoga.com", "support@innerpeaceyoga.com"],
     },
     {
       icon: Clock,
       title: "Working Hours",
       details: ["Mon - Fri: 6:00 AM - 9:00 PM", "Sat - Sun: 7:00 AM - 6:00 PM"],
     },
   ];
 
   return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Contact Us – Get In Touch"
        description="Contact Harmony Yoga Studio in Bangalore. Send inquiries, book consultations, or share feedback. Visit us at 123 Serenity Lane or call +91 98765 43210."
        keywords="contact yoga studio, yoga studio Bangalore, yoga inquiry, book yoga class, yoga feedback, Harmony Yoga contact"
        canonicalPath="/contact"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact Harmony Yoga Studio",
          "description": "Get in touch with Harmony Yoga Studio for inquiries, bookings, and feedback",
          "mainEntity": {
            "@type": "LocalBusiness",
            "name": "Harmony Yoga Studio",
            "telephone": "+919876543210",
            "email": "info@innerpeaceyoga.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "123 Serenity Lane, Wellness District",
              "addressLocality": "Bangalore",
              "addressRegion": "Karnataka",
              "postalCode": "560001",
              "addressCountry": "IN"
            }
          }
        }}
      />
      <FlashNewsTicker />
      <Navbar />
       
       <main className="pt-32 md:pt-36 pb-16">
         {/* Hero Section */}
         <section className="container mx-auto px-4 mb-16">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             className="text-center max-w-3xl mx-auto"
           >
             <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
               Get In Touch
             </span>
             <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
               Contact Us
             </h1>
             <p className="text-lg text-muted-foreground">
               We'd love to hear from you. Whether you have questions about our programs, 
               need assistance, or want to share feedback, our team is here to help.
             </p>
           </motion.div>
         </section>
 
         {/* Contact Info Cards */}
         <section className="container mx-auto px-4 mb-16">
           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {contactInfo.map((info, index) => (
               <motion.div
                 key={info.title}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, delay: index * 0.1 }}
               >
                 <Card className="h-full hover:shadow-lg transition-shadow border-border/50">
                   <CardContent className="p-6 text-center">
                     <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                       <info.icon className="w-6 h-6 text-primary" />
                     </div>
                     <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                     {info.details.map((detail, i) => (
                       <p key={i} className="text-sm text-muted-foreground">
                         {detail}
                       </p>
                     ))}
                   </CardContent>
                 </Card>
               </motion.div>
             ))}
           </div>
         </section>
 
         {/* Forms Section */}
         <section className="container mx-auto px-4 mb-16">
           <div className="grid lg:grid-cols-2 gap-12">
             {/* Contact & Feedback Forms */}
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6, delay: 0.2 }}
             >
               <Tabs defaultValue="contact" className="w-full">
                 <TabsList className="grid w-full grid-cols-2 mb-6">
                   <TabsTrigger value="contact" className="flex items-center gap-2">
                     <Send className="w-4 h-4" />
                     Contact Us
                   </TabsTrigger>
                   <TabsTrigger value="feedback" className="flex items-center gap-2">
                     <MessageSquare className="w-4 h-4" />
                     Feedback
                   </TabsTrigger>
                 </TabsList>
 
                 <TabsContent value="contact">
                   <Card>
                     <CardHeader>
                       <CardTitle>Send us a Message</CardTitle>
                       <CardDescription>
                         Have a question or inquiry? Fill out the form below and we'll respond promptly.
                       </CardDescription>
                     </CardHeader>
                     <CardContent>
                       <Form {...contactForm}>
                         <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
                           <div className="grid sm:grid-cols-2 gap-4">
                             <FormField
                               control={contactForm.control}
                               name="name"
                               render={({ field }) => (
                                 <FormItem>
                                   <FormLabel>Full Name</FormLabel>
                                   <FormControl>
                                     <Input placeholder="Your name" {...field} />
                                   </FormControl>
                                   <FormMessage />
                                 </FormItem>
                               )}
                             />
                             <FormField
                               control={contactForm.control}
                               name="email"
                               render={({ field }) => (
                                 <FormItem>
                                   <FormLabel>Email</FormLabel>
                                   <FormControl>
                                     <Input type="email" placeholder="your@email.com" {...field} />
                                   </FormControl>
                                   <FormMessage />
                                 </FormItem>
                               )}
                             />
                           </div>
                           <div className="grid sm:grid-cols-2 gap-4">
                             <FormField
                               control={contactForm.control}
                               name="phone"
                               render={({ field }) => (
                                 <FormItem>
                                   <FormLabel>Phone Number</FormLabel>
                                   <FormControl>
                                     <Input type="tel" placeholder="+91 98765 43210" {...field} />
                                   </FormControl>
                                   <FormMessage />
                                 </FormItem>
                               )}
                             />
                             <FormField
                               control={contactForm.control}
                               name="subject"
                               render={({ field }) => (
                                 <FormItem>
                                   <FormLabel>Subject</FormLabel>
                                   <FormControl>
                                     <Input placeholder="What's this about?" {...field} />
                                   </FormControl>
                                   <FormMessage />
                                 </FormItem>
                               )}
                             />
                           </div>
                           <FormField
                             control={contactForm.control}
                             name="message"
                             render={({ field }) => (
                               <FormItem>
                                 <FormLabel>Message</FormLabel>
                                 <FormControl>
                                   <Textarea 
                                     placeholder="Tell us more about your inquiry..." 
                                     className="min-h-[120px]"
                                     {...field} 
                                   />
                                 </FormControl>
                                 <FormMessage />
                               </FormItem>
                             )}
                           />
                           <Button 
                             type="submit" 
                             className="w-full" 
                             disabled={isContactSubmitting}
                             title="Send your message to our team"
                           >
                             {isContactSubmitting ? "Sending..." : "Send Message"}
                             <Send className="w-4 h-4 ml-2" />
                           </Button>
                         </form>
                       </Form>
                     </CardContent>
                   </Card>
                 </TabsContent>
 
                 <TabsContent value="feedback">
                   <Card>
                     <CardHeader>
                       <CardTitle className="flex items-center gap-2">
                         <AlertCircle className="w-5 h-5 text-primary" />
                         Report an Issue or Share Feedback
                       </CardTitle>
                       <CardDescription>
                         Help us improve by reporting issues or sharing your experience with us.
                       </CardDescription>
                     </CardHeader>
                     <CardContent>
                       <Form {...feedbackForm}>
                         <form onSubmit={feedbackForm.handleSubmit(onFeedbackSubmit)} className="space-y-4">
                           <div className="grid sm:grid-cols-2 gap-4">
                             <FormField
                               control={feedbackForm.control}
                               name="name"
                               render={({ field }) => (
                                 <FormItem>
                                   <FormLabel>Your Name</FormLabel>
                                   <FormControl>
                                     <Input placeholder="Your name" {...field} />
                                   </FormControl>
                                   <FormMessage />
                                 </FormItem>
                               )}
                             />
                             <FormField
                               control={feedbackForm.control}
                               name="email"
                               render={({ field }) => (
                                 <FormItem>
                                   <FormLabel>Email</FormLabel>
                                   <FormControl>
                                     <Input type="email" placeholder="your@email.com" {...field} />
                                   </FormControl>
                                   <FormMessage />
                                 </FormItem>
                               )}
                             />
                           </div>
                           <FormField
                             control={feedbackForm.control}
                             name="issueType"
                             render={({ field }) => (
                               <FormItem>
                                 <FormLabel>Issue Type</FormLabel>
                                 <FormControl>
                                   <select
                                     {...field}
                                     className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                   >
                                     <option value="">Select an issue type</option>
                                     <option value="bug">Technical Issue / Bug</option>
                                     <option value="suggestion">Suggestion / Feature Request</option>
                                     <option value="complaint">Complaint</option>
                                     <option value="praise">Positive Feedback</option>
                                     <option value="other">Other</option>
                                   </select>
                                 </FormControl>
                                 <FormMessage />
                               </FormItem>
                             )}
                           />
                           <FormField
                             control={feedbackForm.control}
                             name="description"
                             render={({ field }) => (
                               <FormItem>
                                 <FormLabel>Description</FormLabel>
                                 <FormControl>
                                   <Textarea 
                                     placeholder="Please describe the issue or feedback in detail..." 
                                     className="min-h-[150px]"
                                     {...field} 
                                   />
                                 </FormControl>
                                 <FormMessage />
                               </FormItem>
                             )}
                           />
                           <Button 
                             type="submit" 
                             className="w-full" 
                             disabled={isFeedbackSubmitting}
                             title="Submit your feedback"
                           >
                             {isFeedbackSubmitting ? "Submitting..." : "Submit Feedback"}
                             <MessageSquare className="w-4 h-4 ml-2" />
                           </Button>
                         </form>
                       </Form>
                     </CardContent>
                   </Card>
                 </TabsContent>
               </Tabs>
             </motion.div>
 
             {/* Map & About Section */}
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6, delay: 0.3 }}
               className="space-y-6"
             >
               {/* Map */}
               <Card className="overflow-hidden">
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                     <MapPin className="w-5 h-5 text-primary" />
                     Find Us on the Map
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="p-0">
                   <div className="aspect-video w-full">
                     <iframe
                       src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5959!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzE3LjgiTiA3N8KwMzUnNDAuNiJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                       width="100%"
                       height="100%"
                       style={{ border: 0 }}
                       allowFullScreen
                       loading="lazy"
                       referrerPolicy="no-referrer-when-downgrade"
                       title="Inner Peace Yoga Studio Location"
                       className="w-full h-full min-h-[300px]"
                     />
                   </div>
                 </CardContent>
               </Card>
 
               {/* About the Center */}
               <Card>
                 <CardHeader>
                   <CardTitle>About Our Center</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <p className="text-muted-foreground">
                     Inner Peace Yoga Studio is a sanctuary dedicated to holistic wellness and 
                     personal transformation. Founded in 2015, we have been serving the community 
                     with authentic yoga practices rooted in ancient traditions.
                   </p>
                   <div className="grid grid-cols-2 gap-4 pt-4">
                     <div className="text-center p-4 bg-primary/5 rounded-lg">
                       <p className="text-3xl font-bold text-primary">10+</p>
                       <p className="text-sm text-muted-foreground">Years Experience</p>
                     </div>
                     <div className="text-center p-4 bg-primary/5 rounded-lg">
                       <p className="text-3xl font-bold text-primary">5000+</p>
                       <p className="text-sm text-muted-foreground">Happy Students</p>
                     </div>
                     <div className="text-center p-4 bg-primary/5 rounded-lg">
                       <p className="text-3xl font-bold text-primary">15+</p>
                       <p className="text-sm text-muted-foreground">Certified Trainers</p>
                     </div>
                     <div className="text-center p-4 bg-primary/5 rounded-lg">
                       <p className="text-3xl font-bold text-primary">50+</p>
                       <p className="text-sm text-muted-foreground">Weekly Classes</p>
                     </div>
                   </div>
                   <div className="pt-4 space-y-2">
                     <h4 className="font-semibold text-foreground">Facilities:</h4>
                     <ul className="text-sm text-muted-foreground space-y-1">
                       <li>• 3 spacious yoga halls with natural lighting</li>
                       <li>• Air-conditioned practice rooms</li>
                       <li>• Meditation garden and relaxation zone</li>
                       <li>• Changing rooms with shower facilities</li>
                       <li>• Herbal tea lounge and wellness library</li>
                       <li>• Free parking available</li>
                     </ul>
                   </div>
                 </CardContent>
               </Card>
             </motion.div>
           </div>
         </section>
       </main>
 
       <Footer />
       <WhatsAppBubble />
     </div>
   );
 };
 
 export default Contact;