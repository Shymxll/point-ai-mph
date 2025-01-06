// Markdown'ı düz metne çeviren fonksiyon
export const convertMarkdownToPlainText = (markdown: string): string => {
    // Code block'ları ayrı satıra al ve formatı koru
    let text = markdown.replace(/```([\s\S]*?)```/g, '\n$1\n');

    // Inline code'ları koru
    text = text.replace(/`([^`]+)`/g, '$1');

    // Başlıkları temizle
    text = text.replace(/#{1,6}\s/g, '');

    // Kalın ve italik yazıları temizle
    text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
    text = text.replace(/(\*|_)(.*?)\1/g, '$2');

    // Listeleri düzenle
    text = text.replace(/^\s*[-*+]\s+/gm, '• ');
    // Numaralı listeleri koru, sadece fazla boşlukları temizle
    text = text.replace(/^\s*(\d+)\.\s+/gm, '$1. ');

    // Linkleri sadece metne çevir
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

    // Gereksiz boşlukları temizle ama kod bloklarındaki boşlukları koru
    text = text.replace(/\n\s*\n\s*\n/g, '\n\n');

    // Başındaki ve sonundaki boşlukları temizle
    text = text.trim();

    return text;
}