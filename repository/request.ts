/* eslint-disable prettier/prettier */
export interface RequestError {
  status: number;
  message: string;
}

export async function request<TResponse>(
  url: string,
  config: RequestInit = {}
): Promise<TResponse> {
  try {
    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
      // Ensure the Content-Type header is set to application/json
      config.headers = {
        ...config.headers,
        "Content-Type": "application/json",
      };
    }
    const response = await fetch(url, config);
    if (!response.ok) {
      let errorMessage = "";
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;

      const errorResponse: RequestError = {
        message: errorMessage,
        status: response.status,
      };
      throw new Error(JSON.stringify(errorResponse));
    }

    const data = await response.json();
    return data as TResponse;
  } catch (error) {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = "";
      try {
        // Intenta leer el mensaje de error si existe
        const errorData = await response.json();
        errorMessage = errorData.message || "Error desconocido";
      } catch (jsonError) {
        errorMessage = "Error al procesar la respuesta del servidor";
      }

      const errorResponse: RequestError = {
        message: errorMessage,
        status: response.status,
      };
      throw new Error(JSON.stringify(errorResponse));
    }

    // Verifica si la respuesta tiene un contenido válido antes de intentar parsear JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data as TResponse;
    } else {
      // Si no es JSON, solo retorna un valor vacío o maneja el contenido de otra forma
      return {} as TResponse;
    }
  }
}
