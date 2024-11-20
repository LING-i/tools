'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'

export default function ConverterApp() {
  const [currentPage, setCurrentPage] = useState('home')

  const [jsonInput, setJsonInput] = useState('')
  const [jsonOutput, setJsonOutput] = useState('')
  const [jsonOperation, setJsonOperation] = useState('format')
  const [jsonError, setJsonError] = useState('')

  const [timestampInput, setTimestampInput] = useState('')
  const [timestampOutput, setTimestampOutput] = useState('')
  const [timestampOperation, setTimestampOperation] = useState('toDate')
  const [timestampError, setTimestampError] = useState('')

  const handleJsonConvert = () => {
    setJsonError('')
    try {
      let result = ''
      const parsedJson = JSON.parse(jsonInput)

      switch (jsonOperation) {
        case 'format':
          result = JSON.stringify(parsedJson, null, 2)
          break
        case 'minify':
          result = JSON.stringify(parsedJson)
          break
        case 'toArray':
          result = JSON.stringify(Object.entries(parsedJson))
          break
        case 'toObject':
          if (Array.isArray(parsedJson)) {
            const obj = Object.fromEntries(parsedJson)
            result = JSON.stringify(obj, null, 2)
          } else {
            throw new Error('输入不是数组')
          }
          break
        default:
          throw new Error('无效的操作')
      }

      setJsonOutput(result)
    } catch (err) {
      setJsonError(err.message)
      setJsonOutput('')
    }
  }

  const handleTimestampConvert = () => {
    setTimestampError('')
    try {
      let result = ''
      const timestamp = parseInt(timestampInput)

      if (isNaN(timestamp)) {
        throw new Error('无效的时间戳')
      }

      const date = new Date(timestamp * (timestampOperation === 'toDate' ? 1000 : 1))

      if (timestampOperation === 'toDate') {
        result = date.toISOString()
      } else {
        result = Math.floor(date.getTime() / 1000).toString()
      }

      setTimestampOutput(result)
    } catch (err) {
      setTimestampError(err.message)
      setTimestampOutput('')
    }
  }

  const renderHome = () => (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">转换工具</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-4">
        <Button className="w-full bg-white text-black hover:bg-gray-100" onClick={() => setCurrentPage('json')}>
          JSON 转换
        </Button>
        <Button className="w-full bg-white text-black hover:bg-gray-100" onClick={() => setCurrentPage('timestamp')}>
          时间戳转换
        </Button>
      </CardContent>
    </Card>
  )

  const renderJsonConverter = () => (
    <Card className="w-full max-w-3xl">
      <CardHeader className="flex flex-row items-center">
        <Button variant="ghost" size="icon" onClick={() => setCurrentPage('home')} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <CardTitle className="text-2xl font-bold">JSON 转换工具</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="jsonInput" className="block text-sm font-medium text-gray-700 mb-1">
            输入 JSON:
          </label>
          <Textarea
            id="jsonInput"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="在这里粘贴你的 JSON..."
            className="h-40"
          />
        </div>
        <div className="flex justify-between items-center">
          <Select value={jsonOperation} onValueChange={setJsonOperation}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择操作" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="format">格式化</SelectItem>
              <SelectItem value="minify">压缩</SelectItem>
              <SelectItem value="toArray">转换为数组</SelectItem>
              <SelectItem value="toObject">转换为对象</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleJsonConvert}>转换</Button>
        </div>
        <div>
          <label htmlFor="jsonOutput" className="block text-sm font-medium text-gray-700 mb-1">
            输出结果:
          </label>
          <Textarea
            id="jsonOutput"
            value={jsonOutput}
            readOnly
            placeholder="转换后的结果将显示在这里..."
            className="h-40"
          />
        </div>
      </CardContent>
      <CardFooter>
        {jsonError && (
          <div className="flex items-center text-red-500">
            <AlertCircle className="mr-2" />
            <span>{jsonError}</span>
          </div>
        )}
        {!jsonError && jsonOutput && (
          <div className="flex items-center text-green-500">
            <CheckCircle2 className="mr-2" />
            <span>转换成功！</span>
          </div>
        )}
      </CardFooter>
    </Card>
  )

  const renderTimestampConverter = () => (
    <Card className="w-full max-w-3xl">
      <CardHeader className="flex flex-row items-center">
        <Button variant="ghost" size="icon" onClick={() => setCurrentPage('home')} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <CardTitle className="text-2xl font-bold">时间戳转换工具</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="timestampInput" className="block text-sm font-medium text-gray-700 mb-1">
            输入时间戳或日期:
          </label>
          <Input
            id="timestampInput"
            value={timestampInput}
            onChange={(e) => setTimestampInput(e.target.value)}
            placeholder="输入 Unix 时间戳或 ISO 日期..."
          />
        </div>
        <div className="flex justify-between items-center">
          <Select value={timestampOperation} onValueChange={setTimestampOperation}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择操作" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="toDate">时间戳转日期</SelectItem>
              <SelectItem value="toTimestamp">日期转时间戳</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleTimestampConvert}>转换</Button>
        </div>
        <div>
          <label htmlFor="timestampOutput" className="block text-sm font-medium text-gray-700 mb-1">
            输出结果:
          </label>
          <Input
            id="timestampOutput"
            value={timestampOutput}
            readOnly
            placeholder="转换后的结果将显示在这里..."
          />
        </div>
      </CardContent>
      <CardFooter>
        {timestampError && (
          <div className="flex items-center text-red-500">
            <AlertCircle className="mr-2" />
            <span>{timestampError}</span>
          </div>
        )}
        {!timestampError && timestampOutput && (
          <div className="flex items-center text-green-500">
            <CheckCircle2 className="mr-2" />
            <span>转换成功！</span>
          </div>
        )}
      </CardFooter>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4">
      {currentPage === 'home' && renderHome()}
      {currentPage === 'json' && renderJsonConverter()}
      {currentPage === 'timestamp' && renderTimestampConverter()}
    </div>
  )
}