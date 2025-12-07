const DEFAULT_OPTIONS = {
    baseURL: '',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 5000, // Domyślny timeout 5 sekund
};

export class Ajax {
  constructor(globalOptions = {}) 
  {
    this.globalOptions = { 
        ...DEFAULT_OPTIONS, 
        ...globalOptions,
        headers: {
            ...DEFAULT_OPTIONS.headers,
            ...(globalOptions.headers || {}) 
        }
    };
  }
  async _request(url, options = {}) {
    let fullUrl = '';
    const mergedOptions = {
        ...this.globalOptions,
        ...options,
        headers: {
            ...this.globalOptions.headers,
            ...(options.headers || {})
        }
    };
 
  const { baseURL, timeout, ...fetchOptions } = mergedOptions;
  //tworzenie pełnego URL
  fullUrl = baseURL + url;
  // obsługa Timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  fetchOptions.signal = controller.signal; 

  try {
    const response = await fetch(fullUrl, fetchOptions);
    clearTimeout(timeoutId);
        if (!response.ok) {
            
            const errorBody = await response.json().catch(() => null); 
           
            throw new Error(`Błąd HTTP: ${response.status}: ${response.statusText}`, {
                cause: errorBody
            });
        }
        return await response.json();
    } catch (err) {
        clearTimeout(timeoutId);
        if (err.name == 'AbortError') {
            throw new Error(`Przekroczono czas oczekiwania (Timeout po ${timeout}ms) dla URL: ${fullUrl}`);
        }
        throw err;
    }
  }
 //definiowanie metod HTTP
 async get(url, options) {
    return this._request(
        url, 
        {method: 'GET', ...options}
    );
 }
 async post (url, data, options) {
    return this._request(url, {
        method: 'POST',
        body: JSON.stringify(data),
        ...options,
    });
 }
 async put (url, data, options) {
    return this._request(url, {
        method:'PUT',
        body: JSON.stringify(data),
        ...options,
    });
 }
 async delete (url, options) {
    return this._request(url, {method: 'DELETE', ...options});
 }

    
}