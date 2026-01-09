import { Container } from "@mui/material";

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
      return [
            { slug: "1" },
            { slug: "1" },
            { slug: "1" },
      ]
}

const TestSlug = async ({
      params,
}: {
      params: Promise<{ slug: string }>
}) => {
      const { slug } = await params
      return (
            <Container>
                  <span> {slug}</span>
            </Container>
      )
}
export default TestSlug;