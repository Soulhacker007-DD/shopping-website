export async function retryWithBackoff<T>(
    fn: () => Promise<T>, 
    maxRetries = 3, 
    initialDelay = 1000
): Promise<T> {
    let lastError: any;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error: any) {
            lastError = error;
            // Only retry on 503 (Service Unavailable) or 429 (Too Many Requests)
            const status = error.status || (error.response ? error.response.status : null);
            const isRetryable = status === 503 || status === 429 || 
                              error.message?.includes("503") || 
                              error.message?.includes("429") ||
                              error.message?.includes("overloaded");
            
            if (!isRetryable || i === maxRetries - 1) {
                throw error;
            }
            
            const delay = initialDelay * Math.pow(2, i);
            console.warn(`Gemini API Busy/Rate-Limited (Attempt ${i + 1}/${maxRetries}). Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw lastError;
}
