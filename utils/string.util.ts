export const sortKeyWords = (words: string[]) => {
    const filters: Map<string, string[]> = new Map([
        ["Twitter Handles", []],
        ["Hashtags", []],
        ["Key Words", []]
    ]);
    words.forEach((word) => {
        if (word.startsWith("@")) {
            filters.get("Twitter Handles")?.push(word)
        } else if (word.startsWith("#")) {
            filters.get("Hashtags")?.push(word)
        } else {
            filters.get("Key Words")?.push(word)
        }
    })
    return filters
}