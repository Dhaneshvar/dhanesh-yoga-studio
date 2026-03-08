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
 import { useLanguage } from "@/contexts/LanguageContext";
 
 const contactSchema = z.object({
   name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
   email: z.string().trim().email("Please enter a valid email address").max(255),
   phone: z.string().trim().min(10, "Please enter a valid phone number").max(15),
   subject: z.string().trim().min(5, "Subject must be at least 5 characters").max(200),
   message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
 });
 
 const feedbackSchema = z.object({
   name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
   email: z.string().trim().email("Please enter a valid email address").max(255),
   issueType: z.string().trim().min(1, "Please select an issue type"),
   description: z.string().trim().min(20, "Please provide more details").max(1000),
 });
 
 type ContactFormData = z.infer<typeof contactSchema>;
 type FeedbackFormData = z.infer<typeof feedbackSchema>;
 
 const Contact = () => {
   const { toast } = useToast();
   const { t } = useLanguage();
   const [isContactSubmitting, setIsContactSubmitting] = useState(false);
   const [isFeedbackSubmitting, setIsFeedbackSubmitting] = useState(false);
 
   const contactForm = useForm<ContactFormData>({
     resolver: zodResolver(contactSchema),
     defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
   });
 
   const feedbackForm = useForm<FeedbackFormData>({
     resolver: zodResolver(feedbackSchema),
     defaultValues: { name: "", email: "", issueType: "", description: "" },
   });
 
   const onContactSubmit = async (data: ContactFormData) => {
     setIsContactSubmitting(true);
     await new Promise((resolve) => setTimeout(resolve, 1500));
     setIsContactSubmitting(false);
     toast({ title: t('contactPage.messageSent'), description: t('contactPage.messageSentDesc') });
     contactForm.reset();
   };
 
   const onFeedbackSubmit = async (data: FeedbackFormData) => {
     setIsFeedbackSubmitting(true);
     await new Promise((resolve) => setTimeout(resolve, 1500));
     setIsFeedbackSubmitting(false);
     toast({ title: t('contactPage.feedbackReceived'), description: t('contactPage.feedbackReceivedDesc') });
     feedbackForm.reset();
   };
 
   const contactInfo = [
     { icon: MapPin, titleKey: 'contactPage.visitUs', details: [t('contactPage.studioAddress'), t('contactPage.addressLine'), t('contactPage.city')] },
     { icon: Phone, titleKey: 'contactPage.callUs', details: ["+91 98765 43210", "+91 80 1234 5678"] },
     { icon: Mail, titleKey: 'contactPage.emailUs', details: ["info@innerpeaceyoga.com", "support@innerpeaceyoga.com"] },
     { icon: Clock, titleKey: 'contactPage.workingHours', details: [t('contactPage.monFri'), t('contactPage.satSun')] },
   ];
 
   return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Contact Us – Get In Touch" description="Contact Harmony Yoga Studio in Bangalore." keywords="contact yoga studio, yoga inquiry" canonicalPath="/contact" />
      <FlashNewsTicker />
      <Navbar />
       
       <main className="pt-32 md:pt-36 pb-16">
         <section className="container mx-auto px-4 mb-16">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
             <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">{t('contactPage.badge')}</span>
             <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">{t('contactPage.title')}</h1>
             <p className="text-lg text-muted-foreground">{t('contactPage.description')}</p>
           </motion.div>
         </section>
 
         <section className="container mx-auto px-4 mb-16">
           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {contactInfo.map((info, index) => (
               <motion.div key={info.titleKey} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                 <Card className="h-full hover:shadow-lg transition-shadow border-border/50">
                   <CardContent className="p-6 text-center">
                     <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                       <info.icon className="w-6 h-6 text-primary" />
                     </div>
                     <h3 className="font-semibold text-foreground mb-2">{t(info.titleKey)}</h3>
                     {info.details.map((detail, i) => (
                       <p key={i} className="text-sm text-muted-foreground">{detail}</p>
                     ))}
                   </CardContent>
                 </Card>
               </motion.div>
             ))}
           </div>
         </section>
 
         <section className="container mx-auto px-4 mb-16">
           <div className="grid lg:grid-cols-2 gap-12">
             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
               <Tabs defaultValue="contact" className="w-full">
                 <TabsList className="grid w-full grid-cols-2 mb-6">
                   <TabsTrigger value="contact" className="flex items-center gap-2"><Send className="w-4 h-4" />{t('contactPage.contactTab')}</TabsTrigger>
                   <TabsTrigger value="feedback" className="flex items-center gap-2"><MessageSquare className="w-4 h-4" />{t('contactPage.feedbackTab')}</TabsTrigger>
                 </TabsList>
 
                 <TabsContent value="contact">
                   <Card>
                     <CardHeader>
                       <CardTitle>{t('contactPage.formTitle')}</CardTitle>
                       <CardDescription>{t('contactPage.formDesc')}</CardDescription>
                     </CardHeader>
                     <CardContent>
                       <Form {...contactForm}>
                         <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
                           <div className="grid sm:grid-cols-2 gap-4">
                             <FormField control={contactForm.control} name="name" render={({ field }) => (
                               <FormItem><FormLabel>{t('contactPage.fullName')}</FormLabel><FormControl><Input placeholder={t('contactPage.namePlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
                             )} />
                             <FormField control={contactForm.control} name="email" render={({ field }) => (
                               <FormItem><FormLabel>{t('contactPage.email')}</FormLabel><FormControl><Input type="email" placeholder={t('contactPage.emailPlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
                             )} />
                           </div>
                           <div className="grid sm:grid-cols-2 gap-4">
                             <FormField control={contactForm.control} name="phone" render={({ field }) => (
                               <FormItem><FormLabel>{t('contactPage.phone')}</FormLabel><FormControl><Input type="tel" placeholder={t('contactPage.phonePlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
                             )} />
                             <FormField control={contactForm.control} name="subject" render={({ field }) => (
                               <FormItem><FormLabel>{t('contactPage.subject')}</FormLabel><FormControl><Input placeholder={t('contactPage.subjectPlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
                             )} />
                           </div>
                           <FormField control={contactForm.control} name="message" render={({ field }) => (
                             <FormItem><FormLabel>{t('contactPage.message')}</FormLabel><FormControl><Textarea placeholder={t('contactPage.messagePlaceholder')} className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>
                           )} />
                           <Button type="submit" className="w-full" disabled={isContactSubmitting}>
                             {isContactSubmitting ? t('contactPage.sending') : t('contactPage.sendMessage')}<Send className="w-4 h-4 ml-2" />
                           </Button>
                         </form>
                       </Form>
                     </CardContent>
                   </Card>
                 </TabsContent>
 
                 <TabsContent value="feedback">
                   <Card>
                     <CardHeader>
                       <CardTitle className="flex items-center gap-2"><AlertCircle className="w-5 h-5 text-primary" />{t('contactPage.feedbackTitle')}</CardTitle>
                       <CardDescription>{t('contactPage.feedbackDesc')}</CardDescription>
                     </CardHeader>
                     <CardContent>
                       <Form {...feedbackForm}>
                         <form onSubmit={feedbackForm.handleSubmit(onFeedbackSubmit)} className="space-y-4">
                           <div className="grid sm:grid-cols-2 gap-4">
                             <FormField control={feedbackForm.control} name="name" render={({ field }) => (
                               <FormItem><FormLabel>{t('contactPage.yourName')}</FormLabel><FormControl><Input placeholder={t('contactPage.namePlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
                             )} />
                             <FormField control={feedbackForm.control} name="email" render={({ field }) => (
                               <FormItem><FormLabel>{t('contactPage.email')}</FormLabel><FormControl><Input type="email" placeholder={t('contactPage.emailPlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
                             )} />
                           </div>
                           <FormField control={feedbackForm.control} name="issueType" render={({ field }) => (
                             <FormItem><FormLabel>{t('contactPage.issueType')}</FormLabel><FormControl>
                               <select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                 <option value="">{t('contactPage.selectIssueType')}</option>
                                 <option value="bug">{t('contactPage.technicalIssue')}</option>
                                 <option value="suggestion">{t('contactPage.suggestion')}</option>
                                 <option value="complaint">{t('contactPage.complaint')}</option>
                                 <option value="praise">{t('contactPage.positiveFeedback')}</option>
                                 <option value="other">{t('contactPage.other')}</option>
                               </select>
                             </FormControl><FormMessage /></FormItem>
                           )} />
                           <FormField control={feedbackForm.control} name="description" render={({ field }) => (
                             <FormItem><FormLabel>{t('contactPage.descriptionLabel')}</FormLabel><FormControl><Textarea placeholder={t('contactPage.descriptionPlaceholder')} className="min-h-[150px]" {...field} /></FormControl><FormMessage /></FormItem>
                           )} />
                           <Button type="submit" className="w-full" disabled={isFeedbackSubmitting}>
                             {isFeedbackSubmitting ? t('contactPage.submitting') : t('contactPage.submitFeedback')}<MessageSquare className="w-4 h-4 ml-2" />
                           </Button>
                         </form>
                       </Form>
                     </CardContent>
                   </Card>
                 </TabsContent>
               </Tabs>
             </motion.div>
 
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="space-y-6">
               <Card className="overflow-hidden">
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" />{t('contactPage.mapTitle')}</CardTitle>
                 </CardHeader>
                 <CardContent className="p-0">
                   <div className="aspect-video w-full">
                     <iframe
                       src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5959!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzE3LjgiTiA3N8KwMzUnNDAuNiJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                       width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Studio Location" className="w-full h-full min-h-[300px]"
                     />
                   </div>
                 </CardContent>
               </Card>
 
               <Card>
                 <CardHeader><CardTitle>{t('contactPage.studioAddress')}</CardTitle></CardHeader>
                 <CardContent className="space-y-4">
                   <p className="text-muted-foreground">{t('contactPage.mapDesc')}</p>
                   <div className="grid grid-cols-2 gap-4 pt-4">
                     <div className="text-center p-4 bg-primary/5 rounded-lg"><p className="text-3xl font-bold text-primary">10+</p><p className="text-sm text-muted-foreground">{t('heroSection.yearsExperience')}</p></div>
                     <div className="text-center p-4 bg-primary/5 rounded-lg"><p className="text-3xl font-bold text-primary">5000+</p><p className="text-sm text-muted-foreground">{t('heroSection.students')}</p></div>
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
