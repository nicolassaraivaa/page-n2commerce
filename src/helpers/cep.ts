interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export async function fetchCepData(
  zipCode: string,
): Promise<ViaCepResponse | null> {
  const cleanZipCode = zipCode.replace(/\D/g, "");

  if (cleanZipCode.length !== 8) {
    return null;
  }

  try {
    const response = await fetch(
      `https://viacep.com.br/ws/${cleanZipCode}/json/`,
    );

    if (!response.ok) {
      return null;
    }

    const data: ViaCepResponse = await response.json();

    if (data.erro) {
      return null;
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    return null;
  }
}

