
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const Login = () => {
  const { user, loading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    await signIn(email, password);
    setFormLoading(false);
  };

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#ea384c]">FLYERFLIX</h1>
          <p className="text-gray-400 mt-2">Entre na sua conta para acessar a plataforma</p>
        </div>
        
        <Card className="bg-[#222222] border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-white">Login</CardTitle>
            <CardDescription className="text-gray-400">
              Entre com seu email e senha abaixo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#1A1F2C] border-gray-700 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white">Senha</Label>
                  <Link to="/esqueci-senha" className="text-sm text-[#ea384c] hover:underline">
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#1A1F2C] border-gray-700 text-white"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#ea384c] hover:bg-[#ea384c]/80"
                disabled={formLoading || loading}
              >
                {(formLoading || loading) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 items-center">
            <div className="text-gray-400 text-sm">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-[#ea384c] hover:underline">
                Registre-se
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
