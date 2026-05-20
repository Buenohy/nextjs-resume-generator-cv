import Text from "@/components/Text";

export default function page() {
  return (
    <>
      <div>Components Page</div>
      <div>
        <Text as="h1" size="lg" color="primary">Text H1 lg</Text>
        <Text as="h1" size="md" color="primary">Text H1 md</Text>
        <Text as="h1" size="sm" color="primary">Text H1 sm</Text>
      </div>
    </>
  )
}
