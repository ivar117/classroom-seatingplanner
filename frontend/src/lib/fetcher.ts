export class CustomError extends Error {
  info: Response;
  status: number;

  constructor(message: string, info: Response, status: number) {
    super(message);
    this.message = message;
    this.info = info;
    this.status = status;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
};

const fetcher = async (url: string): Promise<Response> => {

    const res = await fetch(url) as Response;

    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    if (!res.ok) {
      const error = new CustomError('An error occurred while fetching the data.', await res.json(), res.status) as CustomError;
      throw error;
    }

    return res.json();
  }

export default fetcher;
