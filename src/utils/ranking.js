export default score => {
  if (score < 200) return 'Memória Lixo'
  if (score < 500) return 'Memória Medíocre'
  if (score < 1000) return 'Memória Padrão'
  if (score < 1500) return 'Memória Bronze'
  if (score < 2000) return 'Memória Prata'
  if (score < 3000) return 'Memória Gold'
  return 'Memória Platina'
}
