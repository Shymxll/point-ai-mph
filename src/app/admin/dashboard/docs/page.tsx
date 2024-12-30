'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DocumentationPage() {
    return (
        <main className="flex-1 overflow-y-hidden p-6">
            <h2 className="text-2xl font-bold mb-6">Documentation</h2>

            <Tabs defaultValue="system-prompts" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="system-prompts">System Prompts</TabsTrigger>
                    <TabsTrigger value="prompt-engineering">Prompt Engineering</TabsTrigger>
                </TabsList>

                <TabsContent value="system-prompts" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>System Prompts Nedir?</CardTitle>
                            <CardDescription>
                                AI asistanın davranışını ve rolünü belirleyen temel yönergeler
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>System promptları, AI modelinin nasıl davranması gerektiğini belirleyen özel talimatlardır. Örneğin:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Sen yardımcı bir asistansın ve her zaman nazik bir şekilde cevap verirsin.</li>
                                <li>Sen bir yazılım geliştirme uzmanısın ve kod örnekleriyle açıklamalar yaparsın.</li>
                                <li>Sen bir eğitmensin ve karmaşık konuları basitleştirerek anlatırsın.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>İyi Bir System Prompt Nasıl Olmalı?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Net ve spesifik olmalı</li>
                                <li>AI&apos;nin rolünü açıkça tanımlamalı</li>
                                <li>Beklenen çıktı formatını belirtmeli</li>
                                <li>Kısıtlamaları ve sınırları tanımlamalı</li>
                                <li>Tutarlı bir ton ve üslup belirlenmeli</li>
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="prompt-engineering" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Etkili Prompt Yazma Teknikleri</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <h3 className="text-lg font-semibold">1. Açık ve Net Olun</h3>
                                    <p>İstediğiniz şeyi net bir şekilde belirtin. Belirsiz ifadelerden kaçının.</p>

                            <h3 className="text-lg font-semibold mt-4">2. Bağlam Sağlayın</h3>
                            <p>AI&apos;ya gerekli tüm bilgileri verin. Örnek:</p>
                            <pre className="bg-muted p-4 rounded-md mt-2">
                                &quot;Ben bir e-ticaret sitesi geliştiriyorum ve ürün açıklamaları yazmam gerekiyor.
                                Hedef kitle: 25-35 yaş arası profesyoneller.
                                Ton: Profesyonel ama samimi.&quot;
                            </pre>

                            <h3 className="text-lg font-semibold mt-4">3. Format Belirtin</h3>
                            <p>İstediğiniz çıktı formatını açıkça belirtin:</p>
                            <pre className="bg-muted p-4 rounded-md mt-2">
                                &quot;Lütfen cevabını şu formatta ver:
                                - Başlık
                                - Madde işaretli liste
                                - Özet&quot;
                            </pre>

                            <h3 className="text-lg font-semibold mt-4">4. Örnekler Kullanın</h3>
                            <p>İstediğiniz çıktıya benzer örnekler vererek AI&apos;yı yönlendirin.</p>

                            <h3 className="text-lg font-semibold mt-4">5. Aşamalı İlerleyin</h3>
                            <p>Karmaşık görevleri küçük parçalara bölerek ilerleyin.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Yaygın Hatalar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Çok belirsiz promptlar yazmak</li>
                                <li>Yetersiz bağlam sağlamak</li>
                                <li>Çok uzun ve karmaşık promptlar yazmak</li>
                                <li>Format belirtmemek</li>
                                <li>Çelişkili talimatlar vermek</li>
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    )
} 