
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { useSiteConfig } from "@/hooks/useSiteConfig";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { data: config } = useSiteConfig();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        window.location.href = "/";
      }
    };
    checkSession();
  }, []);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Ocorreu um erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  // Get background image from config
  const backgroundImage = config?.login_background_image 
    ? `url(${config.login_background_image})` 
    : 'linear-gradient(to right, #0f0f10, #2d2d32)';

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left side with background image and quote */}
      <div 
        className="hidden md:flex md:w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 flex flex-col justify-end p-12">
          <div className="max-w-md">
            <p className="text-white text-xl mb-4 font-light">
              {config?.login_quote_text || "No futuro, a tecnologia nos permitirá criar realidades alternativas tão convincentes que será difícil distinguir o que é real do que é simulado."}
            </p>
            <div>
              <p className="text-white font-semibold">
                {config?.login_quote_author || "Jaron Lanier"}
              </p>
              <p className="text-white/70 text-sm">
                {config?.login_quote_author_title || "Cientista da computação e especialista em realidade virtual."}
              </p>
            </div>
          </div>
          <p className="text-white/60 text-sm mt-12">
            {config?.login_developer_text || "2025 | Desenvolvido por Vinícius Dev"}
          </p>
        </div>
      </div>
      
      {/* Right side with reset password form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 bg-black text-white">
        <div className="w-full max-w-md bg-[#0F0F10] rounded-2xl p-8" style={{ backgroundColor: config?.login_card_background_color || '#0F0F10' }}>
          {/* Site logo or title added here - agora maior */}
          {config?.navbar_logo_type === 'image' && config?.navbar_logo_image ? (
            <div className="flex justify-center mb-8">
              <img 
                src={config.navbar_logo_image} 
                alt="Logo" 
                className="h-20 w-auto object-contain" 
              />
            </div>
          ) : (
            <h2 className="text-3xl font-bold text-center mb-8" style={{ color: config?.login_button_color || '#CB5EEE' }}>
              {config?.navbar_logo_text || 'Vale Notícias'}
            </h2>
          )}
          
          <h1 className="text-2xl font-bold mb-8 text-center">Recuperar Senha</h1>
          
          {submitted ? (
            <div className="text-center space-y-4">
              <p className="text-gray-300">
                Se houver uma conta associada com <strong>{email}</strong>, 
                enviaremos um link para redefinir sua senha.
              </p>
              <p className="text-gray-300">
                Por favor, verifique seu email.
              </p>
              <Button
                className="mt-6"
                style={{ 
                  backgroundColor: config?.login_button_color || '#CB5EEE',
                  color: config?.login_button_text_color || '#FFFFFF' 
                }}
                onClick={() => setSubmitted(false)}
              >
                Tentar novamente
              </Button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-0 border-b border-gray-700 rounded-none focus:ring-0 px-0 py-2 text-white placeholder-gray-500"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full py-2 rounded-xl"
                style={{ 
                  backgroundColor: config?.login_button_color || '#CB5EEE',
                  color: config?.login_button_text_color || '#FFFFFF' 
                }}
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar instruções"}
              </Button>
              <div className="text-center mt-4">
                <Link 
                  to="/login" 
                  className="text-sm hover:underline"
                  style={{ color: config?.login_button_color || '#CB5EEE' }}
                >
                  Voltar para o login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
