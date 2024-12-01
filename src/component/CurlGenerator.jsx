import { useState } from 'react';
import { Copy, Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from "@/hooks/use-toast"

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']
function CurlGenerator() {
  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState('')
  const [headers, setHeaders] = useState('')
  const [body, setBody] = useState('')
  const { toast } = useToast()

  const generateCurl = () => {
    if (!url) return ""

    let curl = `curl -X ${method} "${url}"`

    if (headers.trim()) {
      headers.split('\n').forEach(header => {
        if (header.trim()) {
          curl += ` \\\n  -H "${header.trim()}"`
        }
      })
    }

    // Add body for POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
      curl += ` \\\n  -d '${body.trim()}'`
    }

    return curl
  }

  const copyToClipboard = () => {
    const curl = generateCurl()
    if (curl) {
      navigator.clipboard.writeText(curl)
      toast({
        title: "Copied!",
        description: "Your curl command has been copied to clipboard",
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Curl Request Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="method">Request Method</Label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger id="method" className="w-full">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              {HTTP_METHODS.map(m => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            placeholder="https://api.example.com/endpoint"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="headers">Headers (one per line)</Label>
          <Textarea
            id="headers"
            placeholder="Content-Type: application/json
Authorization: Bearer token"
            value={headers}
            onChange={e => setHeaders(e.target.value)}
            className="min-h-[100px] font-mono"
          />
        </div>

        {['POST', 'PUT', 'PATCH'].includes(method) && (
          <div className="space-y-2">
            <Label htmlFor="body">Request Body</Label>
            <Textarea
              id="body"
              placeholder={'{\n  "key": "value"\n}'}
              value={body}
              onChange={e => setBody(e.target.value)}
              className="min-h-[100px] font-mono"
            />
          </div>
        )}

        <div className="space-y-4">
          <Button
            className="w-full"
            onClick={copyToClipboard}
            disabled={!url}
          >
            <Copy className="w-4 h-4 mr-2" />
            Generate Curl
          </Button>

          {url && (
            <pre className="p-4 bg-muted rounded-lg overflow-x-auto whitespace-pre-wrap break-all flex flex-col">
              <code>{generateCurl()}</code>
              <div className="text-right items-center flex justify-end mt-4">
                <Clipboard onClick={copyToClipboard} className='cursor-pointer w-4 h-4' />
              </div>
            </pre>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default CurlGenerator;
