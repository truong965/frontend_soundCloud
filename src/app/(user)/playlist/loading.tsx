import { resolve } from "path"

export default async function Loading() {

      await new Promise(resolve => setTimeout(resolve, 3000))
      // Or a custom loading skeleton component
      return <p>Loading...</p>
}