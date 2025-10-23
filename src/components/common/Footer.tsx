export default function Footer() {
  return (
    <footer className="bg-[#0f1219] text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent mb-2">
              N2Commerce
            </h3>
            <p className="text-gray-400">Sua loja virtual começa aqui</p>
          </div>

          <div className="flex items-center gap-2 text-gray-400">
            <span>Desenvolvido por N2Softwere</span>
          </div>

          <div className="text-gray-400 text-center md:text-right">
            <p>&copy; 2025 N2Commerce</p>
            <p className="text-sm">Todos os direitos reservados</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
