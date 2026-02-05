import { SignUp } from "@clerk/nextjs"

const appearance = {
  elements: {
    card: "shadow-none bg-transparent",
    headerTitle: "text-white text-2xl font-bold",
    headerSubtitle: "text-slate-400",
    socialButtonsBlockButton: "bg-white/5 border-white/10 hover:bg-white/10 text-white transition-all duration-300",
    socialButtonsBlockButtonText: "text-white font-medium",
    dividerLine: "bg-white/10",
    dividerText: "text-slate-500",
    formFieldLabel: "text-slate-300 font-medium",
    formFieldInput: "bg-white/5 border-white/10 text-white focus:ring-indigo-500 focus:border-indigo-500 rounded-lg",
    formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-lg shadow-indigo-500/20 transition-all duration-300 normal-case font-bold h-11",
    footerActionText: "text-slate-400",
    footerActionLink: "text-indigo-400 hover:text-indigo-300 font-medium transition-colors",
    identityPreviewText: "text-white",
    identityPreviewEditButtonIcon: "text-indigo-400",
    formFieldInputShowPasswordButton: "text-slate-400 hover:text-white"
  },
  layout: {
    socialButtonsPlacement: "bottom",
    showOptionalFields: false,
  }
};

export default function Page() {
  return <SignUp appearance={appearance} />
}