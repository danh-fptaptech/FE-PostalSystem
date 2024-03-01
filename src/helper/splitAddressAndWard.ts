export default function splitAddressAndWard(value: string) {
    console.log('value', value);
    const parts = value.split(/,\s*Ward:\s*/);
    const address = parts[0].trim();
    const ward = parts[1]?parts[1].trim():null;
    return { address, ward };
}