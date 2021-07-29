import { getPerformanceMetrics } from '@platform-os/testcafe-helpers';

fixture('Speedtest').page("http://localhost:3000/");

test("Performance Test", async t => {
  const perf = await getPerformanceMetrics({t})
  const computed = perf.computed

  //Time to First Byte
  //Processing Time
  //Dom Ready Time 

  console.log(`TTFB: ${computed.ttfb} ms - Processing Time: ${computed.processing} ms -  DOM Ready Time: ${computed.domReady} ms`)

  await t.expect(computed.ttfb).lt(3000)
  await t.expect(computed.processing).lt(8000)
  await t.expect(computed.domReady).lt(8000)

})