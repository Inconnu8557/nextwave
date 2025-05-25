
export default function VerifyEmail() {
  return (
    <div className="max-w-md p-8 mx-auto mt-12 text-center border rounded-xl bg-white/5 backdrop-blur-sm border-white/10">
      <h2 className="mb-4 text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
        Vérifie ta boîte mail
      </h2>
      <p className="mb-2 text-gray-300">Un email de confirmation vient de t'être envoyé.</p>
      <p className="text-sm text-gray-400">Clique sur le lien dans l'email pour activer ton compte.<br/>Pense à vérifier tes spams !</p>
    </div>
  );
}
