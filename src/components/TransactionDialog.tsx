import { useState } from "react"
import { apiAccountService } from "../services/apiAccountService"

interface TransactionDialogProps {
  username: string
  onSuccess: () => void
}

export function TransactionDialog({ username, onSuccess }: TransactionDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [receiverUsername, setReceiverUsername] = useState("")
  const [value, setValue] = useState<number | "">("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!receiverUsername || !value) return alert("Preencha todos os campos!")

    try {
      setLoading(true)
      let senderUsername = username;
      const data = {senderUsername, receiverUsername, value}
      await apiAccountService.createTransaction(data)
      onSuccess()
      setIsOpen(false)
      setReceiverUsername("")
      setValue("")
      alert("Transação criada com sucesso!")
    } catch (error) {
      console.error(error)
      alert("Erro ao criar transação.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
      >
        Nova Transação
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Nova Transação</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPF / Username do destinatário
                </label>
                <input
                  type="text"
                  value={receiverUsername}
                  onChange={(e) => setReceiverUsername(e.target.value)}
                  placeholder="Digite o username"
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) =>
                    setValue(e.target.value ? Number(e.target.value) : "")
                  }
                  placeholder="Ex: 100.00"
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  {loading ? "Enviando..." : "Confirmar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
