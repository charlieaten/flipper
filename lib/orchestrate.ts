interface Customer {
  email: string;
  name: string;
}

export class Orchestrate {
  static readonly API_KEY = process.env.ORCHESTRATE_API_KEY;

  static async post(path: string, options: { json: unknown }) {
    return await fetch(`https://sandbox.orchestrate.global/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Orchestrate.API_KEY,
      },
      body: JSON.stringify(options.json),
    });
  }

  static async put(path: string, options: { json: unknown }) {
    return await fetch(`https://sandbox.orchestrate.global/${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Orchestrate.API_KEY,
      },
      body: JSON.stringify(options.json),
    });
  }
}
