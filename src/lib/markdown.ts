

// Markdown'ı düz metne çeviren fonksiyon
export const convertMarkdownToPlainText = (markdown: string): string => {
    // Code block'ları temizle
    let text = markdown.replace(/```[\s\S]*?```/g, '');

    // Başlıkları temizle
    text = text.replace(/#{1,6}\s/g, '');

    // Kalın ve italik yazıları temizle
    text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
    text = text.replace(/(\*|_)(.*?)\1/g, '$2');

    // Listeleri düzenle
    text = text.replace(/^\s*[-*+]\s+/gm, '• ');
    text = text.replace(/^\s*\d+\.\s+/gm, '');

    // Linkleri sadece metne çevir
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

    // Gereksiz boşlukları temizle
    text = text.replace(/\n\s*\n/g, '\n\n');
    text = text.trim();


    return text;
}